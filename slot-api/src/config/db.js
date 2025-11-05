import mongoose from 'mongoose';


export const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing');

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    maxPoolSize: 10
  });

  console.log('MongoDB connected');

  const { name, host, port } = mongoose.connection;
  console.log(`DB -> ${name} @ ${host}:${port}`);
};
