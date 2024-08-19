import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import connectToMongoDB from './connectToDb';
import Book from '../models/book.model';
import cliProgress from 'cli-progress';
import ansiColors from 'ansi-colors';

const importData = async () => {
  const errorsLog: string[] = [];
  const errorFilePath = path.join(__dirname, '../../../jsonDB/import_errors.log');

  const bar = new cliProgress.SingleBar(
    {
      format: `Importing data [{bar}] {percentage}% | {value}/{total} items`,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
    },
    cliProgress.Presets.shades_classic
  );

  try {
    const filePath = path.join(__dirname, '../../../jsonDB/bookParse.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    if (fs.existsSync(errorFilePath)) {
      fs.unlinkSync(errorFilePath);
    }

    if (Array.isArray(data)) {
      await Book.deleteMany({});
      console.log(ansiColors.blue('Existing data cleared'));

      bar.start(data.length, 0);

      // for (let i = 0; i < data.length); i++) {
      // Limit to 500 items
      for (let i = 0; i < 500; i++) {
        const item = data[i];

        try {
          await Book.create(item);
        } catch (e) {
          const err = e as Error;
          const errorMessage = `Error inserting item ${i}: ${
            err ? err.message : String(err)
          }, number of errors: ${errorsLog.length + 1}`;
          errorsLog.push(errorMessage);
        }
        bar.update(i + 1);
      }

      bar.stop();
      console.log(ansiColors.blue('Data successfully imported!!!'));
    } else {
      console.error(ansiColors.red('Data is not an array'));
    }
  } catch (e) {
    const err = e as Error;
    const errorMessage = `Error in import json data: ${err.message}`;
    errorsLog.push(errorMessage);
  } finally {
    if (errorsLog.length > 0) {
      fs.writeFileSync(errorFilePath, errorsLog.join('\n'), 'utf-8');
      console.log(ansiColors.red(`Number of errors: ${errorsLog.length}`));
    }
    await mongoose.connection.close();
  }
};

const run = async () => {
  await connectToMongoDB();
  await importData();
};

run();
