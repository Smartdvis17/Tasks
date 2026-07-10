import moongoose from 'mongoose';

//Funcion de conexion a la base de datos
export const connectDB = async () => {
    try {
        const db = await moongoose.connect( `${process.env.MONGO_URI}/${process.env.DATABASE_NAME}`);
        console.log(`Conectado a la base de datos ${process.env.DATABASE_NAME}`);
    } catch (error) {
        console.log(`Error al conectar a la base de datos ${process.env.DATABASE_NAME}: ${error.message}`);
    }
}