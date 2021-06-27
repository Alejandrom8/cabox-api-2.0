const user = require('./src/core/models/User');
const box = require('./src/core/models/Box');

async function sync () {
    await user.sync();
    await box.sync();
    console.log('All models synched');
}

sync();