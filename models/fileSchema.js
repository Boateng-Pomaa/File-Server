import mongoose from "mongoose"

const {Schema,model} = mongoose


const fileSchema = new Schema(
    {
      title: {
        type: String,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      file_path: {
        type: String,
        required: true
      },
      file_mimetype: {
        type: String,
        required: true
      }
    },
    {
      timestamps: true
    }
  )


  export const fileModel = model("files",fileSchema)