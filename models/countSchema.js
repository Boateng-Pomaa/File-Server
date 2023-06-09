import mongoose from "mongoose"


const { Schema, model } = mongoose

const countSchema = new Schema({

    filename: {
        type: String
    },
    download_count: {
        type: Number
    },
    email_count: {
        type: Number
    }
})

export const fileCount = model('file count', countSchema)