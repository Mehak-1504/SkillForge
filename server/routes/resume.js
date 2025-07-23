const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const router = express.Router();

const skillMap = require('../skillMap');
const recommendations = require('../recommendations');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'server/uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/upload', upload.single('resume'), (req, res) => {
  const filePath = req.file.path;
  const jobRole = req.body.jobRole;

  if (!jobRole || !skillMap[jobRole]) {
    return res.status(400).json({ error: 'Invalid or missing job role' });
  }

  exec(`python ./server/resume-parser/parser.py ${filePath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Python Error:", err);
      return res.status(500).json({ error: 'Failed to parse resume' });
    }

    try {
      const parsed = JSON.parse(stdout);
      const resumeSkillsRaw = parsed.skills || [];

      const resumeSkills = resumeSkillsRaw.map(skill => skill.toLowerCase());
      const requiredSkills = skillMap[jobRole].map(skill => skill.toLowerCase());

      const missingSkills = requiredSkills.filter(skill => !resumeSkills.includes(skill));

      const recommendedResources = {};
      missingSkills.forEach(skill => {
        const matched = Object.keys(recommendations).find(
          key => key.toLowerCase() === skill
        );
        if (matched) {
          recommendedResources[matched] = recommendations[matched];
        }
      });

      console.log("✅ Sending response to frontend:");
      console.log({
        msg: "Resume uploaded successfully!",
        data: parsed,
        jobRole,
        missingSkills,
        recommendedResources
      });

      res.json({
        msg: "Resume uploaded successfully!",
        data: parsed || {},
        jobRole: jobRole || "Not specified",
        missingSkills: missingSkills || [],
        recommendedResources: recommendedResources || {}
      });

    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
      res.status(500).json({ error: 'Failed to process parsed data' });
    }
  });
});

module.exports = router;