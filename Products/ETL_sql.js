const fs = require('fs');
const { Client } = require('pg');
const copyFrom = require('pg-copy-streams').from;
const DB = require('./config');

const connectionString = `postgres://${DB.DB_USERNAME}:${DB.DB_PASSWORD}@localhost:5432/${DB.DB_NAME}`;
const client = new Client(connectionString);

client.connect();

const stream = client.query(copyFrom(`COPY product FROM STDIN WITH CSV HEADER NULL 'null'`));
const readStream = fs.createReadStream('./product.csv');
readStream.pipe(stream);
readStream.on('error', err => {
  console.log(err);
  client.end();
});
stream.on('error', err => {
  console.log(err);
  client.end();
});
stream.on('finish', () => {
  console.log('Finished Products');
  const stream = client.query(copyFrom(`COPY features FROM STDIN WITH CSV HEADER NULL 'null'`));
  const readStream = fs.createReadStream('./features.csv');
  readStream.pipe(stream);
  readStream.on('error', err => {
    console.log(err);
    client.end();
  });
  stream.on('error', err => {
    console.log(err);
    client.end();
  });
  stream.on('finish', () => {
    console.log('Finished Features');
    const stream = client.query(copyFrom(`COPY related FROM STDIN WITH CSV HEADER NULL 'null'`));
    const readStream = fs.createReadStream('./related.csv');
    readStream.pipe(stream);
    readStream.on('error', err => {
      console.log(err);
      client.end();
    });
    stream.on('error', err => {
      console.log(err);
      client.end();
    });
    stream.on('finish', () => {
      console.log('Finished Related');
      const stream = client.query(copyFrom(`COPY styles FROM STDIN WITH CSV HEADER NULL 'null'`));
      const readStream = fs.createReadStream('./styles.csv');
      readStream.pipe(stream);
      readStream.on('error', err => {
        console.log(err);
        client.end();
      });
      stream.on('error', err => {
        console.log(err);
        client.end();
      });
      stream.on('finish', () => {
        console.log('Finished Styles');
        const stream = client.query(copyFrom(`COPY photos FROM STDIN WITH CSV HEADER NULL 'null'`));
        const readStream = fs.createReadStream('./photos.csv');
        readStream.pipe(stream);
        readStream.on('error', err => {
          console.log(err);
          client.end();
        });
        stream.on('error', err => {
          console.log(err);
          client.end();
        });
        stream.on('finish', () => {
          console.log('Finished Photos');
          const stream = client.query(copyFrom(`COPY skus FROM STDIN WITH CSV HEADER NULL 'null'`));
          const readStream = fs.createReadStream('./skus.csv');
          readStream.pipe(stream);
          readStream.on('error', err => {
            console.log(err);
            client.end();
          });
          stream.on('error', err => {
            console.log(err);
            client.end();
          });
          stream.on('finish', () => {
            console.log('Finished SKUs');
            client.end();
          });
        });
      });
    });
  });
});

// const {Client} = require('pg');
// const fs = require('fs');
// const readline = require('readline');
// const stream = require('stream');

// const productInstream = fs.createReadStream('./product.csv');
// const productOutstream = new stream;
// const productReadline = readline.createInterface(productInstream, productOutstream);

// const connectionString = 'postgres://root:mypsequel42@localhost:5432/pgsample6';
// const productClient = new Client(connectionString);

// productClient.connect();

// let columns = '';

// productReadline.on('line', line => {
//   line = line.replace(/,/g , ', ');
//   line = line.replace(/  /g , ' ');
//   line = line.replace(/'/g, `''`);
//   line = line.replace(/"/g, `'`);
//   console.log(line);

//   if (line.substring(0, 2) === 'id') {
//     columns = line;
//   } else {
//     productClient.query(`INSERT INTO product (${columns}) VALUES (${line})`)
//     .catch(err => console.log(line, err));
//   }
// });

// productReadline.on('close', () => {
//   console.log('finished');
// });