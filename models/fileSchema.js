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
      image: {
        data: Buffer,
        contentType: String
      }
    },
    {
      timestamps: true
    }
  )


  export const fileModel = model("files",fileSchema)