import { connect } from 'mongoose';
import { MONGO_DB_TOKEN } from './dbUrl';
import ansiColors from 'ansi-colors';

const connectToMongoDB = async () => {
  try {
    await connect(MONGO_DB_TOKEN);
    console.log(ansiColors.blue('Connected to MongoDB'));
  } catch (e: unknown) {
    const err = e as Error;
    console.log(ansiColors.red(`Error connecting to MongoDB: ${err.message}`));
  }
};

export default connectToMongoDB;
