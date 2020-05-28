const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'candidates',
    default: null
  },
  manager:{
    type: Schema.Types.ObjectId,
    ref: 'managers',
    default: null
  },
  manager_id:{
    type: Schema.Types.ObjectId,
    ref: 'managers',
    default: null
  },
  organization_id:{
    type: Schema.Types.ObjectId,
    ref: 'organizations',
    default: null
  },
  path: {
    type: String
  },
  dob: {
    type: Date,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  hometown: {
    type: String
  },
  city: {
    type: String
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  interests: {
    type: [String],
    required: true
  },
  achievements: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },

  experience: [
    {
      jobtitle: {
        type: String,
        required: true
      },
      jobcompany: {
        type: String,
        required: true
      },
      joblocation: {
        type: String
      },
      jobfrom: {
        type: Date,
        required: true
      },
      jobto: {
        type: Date
      },
      jobcurrent: {
        type: Boolean,
        default: false
      },
      jobdescription: {
        type: String
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      educationfrom: {
        type: Date,
        required: true
      },
      educationto: {
        type: Date
      },
      educationcurrent: {
        type: Boolean,
        default: false
      },
      educationdescription: {
        type: String
      }
    }
  ],
  social: {
    githubusername: {
      type: String
    },
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profiles', ProfileSchema);
