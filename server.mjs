import { connect } from 'mongoose';
import config from './config.mjs';
import app from './src/app.mjs';

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}...`);
});

connect(config.DATABASE_URI).then(() => {
  console.log('Successfully connected to database...');
});
