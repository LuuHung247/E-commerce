const app = require('./src/app');

const PORT = 3000
const Server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', () => {
    Server.close(() => {
        console.log('Server is closed');
    });
}
);