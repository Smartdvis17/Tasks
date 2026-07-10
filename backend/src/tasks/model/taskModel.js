import mongoose from 'mongoose';


const {Schema, model} = mongoose;

const taskSchema = new Schema({
            title: { 
                type: String, 
                required: true 
            },

            description: { 
                type: String, 
                required: true, 
                default: 'sin descripcion'
            },

            status: {
                type: String,
                enum: ['pendiente',  'completada'],
                default: 'pendiente'
            },
        },
        { timestamps: true }
    );

export const taskModel = model('task', taskSchema);