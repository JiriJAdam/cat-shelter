const url = require('url');
const fs = require('fs'); // File System
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
            console.log("the brees are currently ", breeds)
            let catBreedPlaceHolder = breeds.map( (breed) => `<option value"${breed}">${breed}</option>`);
            console.log(catBreedPlaceHolder);
            let modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceHolder)
                                                    //        <option value="Fluffy Cat">Fluffy Cat</option>
            res.write(modifiedData);
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

        let form = new formidable.IncomingForm();
        
            form.parse(req, (err, fields, files) => {
                console.log(files.upload.name);
                if (err) {
                    console.log(err);
                    return;
                }
                const oldPath = files.upload.path;
                const newPath = path.normalize(path.join('./content/images', files.upload.name));
                console.log(files);

                fs.rename(oldPath, newPath, err => {
                    if (err) {
                        console.log(err);
                        return
                    }
                    console.log('Files were uploaded successfully');
                })

                fs.readFile('./data/cats.json', 'utf-8', (err, data) => {
                    if (err) {
                        console.log(err)
                        return
                    }

                    const allCats = JSON.parse(data);
                    allCats.push({ id: cats.length + 1, ...fields, image: files.upload.name});
                    const json = JSON.stringify(allCats);
                    fs.writeFile('./data/cats.json', json, () => {
                        res.writeHead(301, { location: '/'});
                        res.end();
                    });
                });
                console.log("the fields are", fields);
                console.log("the file(s) are", files);
            });

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
                console.log('the raw dataJSON is', data)
                let currentBreeds = JSON.parse(data);
                currentBreeds.push(parsedData.breed);
                console.log("the breeds.json parsed data is the variable currentBreeds" , currentBreeds);
                let updatedBreeds = JSON.stringify(currentBreeds);
                console.log("JSON updated ready to save updated breeds", updatedBreeds);

                fs.writeFile('./data/breeds.json', updatedBreeds, 'utf-8', () => {
                    if (err) {
                        console.log(err)
                    }
                    console.log("The breeds was uploaded successfully...")
                })

                res.writeHead(201, { location: '/'});
                res.end();

            })
        });
    } else {
        return true;
    }
}