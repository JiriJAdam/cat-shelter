const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const cats = require('../data/cats.json');
const breeds = require('../data/breeds.json');


module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;
    console.log("[home.js 10]home pathname is ", pathname);
    if (pathname === '/' && req.method === 'GET') {

        // Implement the logic for showing the home html view
        let filePath = path.normalize(
            path.join(__dirname, '../views/home/index.html')
        );
        fs.readFile(filePath, (err, data) => {
            if(err) {
                console.log(err);
                res.write(404, {
                    "Content-Type": "text/plain"
                });
                res.write(404);
                res.end();
                return
            }
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.write(data);
            res.end();
        });

    } else if (pathname === '/cats/add-cat' && req.method === 'GET') {
        let filePath = path.normalize(path.join(__dirname, './views/addCat.html'));

        const index = fs.createReadStream(filePath);

        index.on('data', (data) => {
            res.write(data);
        });
        index.on('end', () => {
            res.end();
        });
        index.on('error', (err) => {
            console.log(err);
        })
    } else if (pathname === '/cats/add-breed' && req.method === 'GET') {
        let filePath = path.normalize(path.join(__dirname, '../views/addBreed.html'));

        const index = fs.createReadStream(filePath);

        index.on('data', (data) => {
            res.write(data);
        });
        index.on('end', () => {
            res.end();
        });
        index.on('error', (err) => {
            console.log(err);
        })
    } else if (pathname === '/cats/add-cat' && req.method === 'POST') {

        const index = fs.createReadStream(filePath);

        index.on('data', (data) => {
            res.write(data);
        });
        index.on('end', () => {
            res.end();
        });
        index.on('error', (err) => {
            console.log(err);
        })
    } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
        let formData = "";
        
        req.on('data', (data) => {
            console.log("the breed form data is", data.toString());
            formData += data;
            console.log("the new data is", formData.breed);
            console.log('I want the form data to be just "testing"');
            let parsedData = qs.decode(formData);
            console.log("the parsed data is", parsedData.breed);

            fs.readFile("./data/breeds.json", 'utf8', (err, data) => {
                if (err) {
                    console.error(err)
                    return
                }
                let currentBreeds = JSON.parse(data);
                console.log("the breeds.json data is" , JSON.parse(data));
            })
        });
    } else {
        return true;
    }
}