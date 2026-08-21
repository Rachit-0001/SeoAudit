const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true
        },

        score: {
            type: Number,
            required: true
        },

        title: {
            type: String
        },

        description: {
            type: String
        },

        h1: {
            type: Number
        },

        h2: {
            type: Number
        },

        images: {
            type: Number
        },

        missingAlt: {
            type: Number
        },

        links: {
            type: Number
        },

        canonical: {
            type: String
        },

        issues: [
            {
                type: {
                    type: String
                },

                message: {
                    type: String
                }
            }
        ]
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Audit", auditSchema);