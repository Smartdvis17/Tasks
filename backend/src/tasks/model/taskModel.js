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

            startDate: {
                type: Date
            },

            endDate: {
                type: Date
            },

            startTime: {
                type: String
            },

            endTime: {
                type: String
            },
        },
        { timestamps: true }
    );

export const taskModel = model('task', taskSchema);