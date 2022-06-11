const axios = require('axios');
const fs = require('fs');
const AdmZip = require("adm-zip");
const { spawn } = require("child_process");

const blue = '\u001b[34m'
const white = '\u001b[0m'
//const cyan = '\u001b[36;1m'
const cyan =  '\u001b[36m'
const red = '\u001b[31m'


console.log(cyan)
console.log( " _     _          _                    _              ")   
console.log(  "| |   | |        | |    ___   __ _  __| | ___ _ __   ")  
console.log(  "| |   | |   _____| |   / _ \\ / _` |/ _` |/ _ \\ '__|")  
console.log(  "| |___| |__|_____| |__| (_) | (_| | (_| |  __/ |     ")  
console.log(  "|_____|_____|    |_____\\___/ \\__,_|\\__,_|\\___|_| ")
console.log(white)

let BDS = '1.18.31.04'
let LL_link
let LL



function gen(){
    if(parseInt(LL.split('.')[0]) >= 2 && parseInt(LL.split('.')[1]) >= 2){
        const bat = spawn('cmd.exe', ['/c', 'cd .\\LiteLoader-' + BDS + '&& LLPeEditor.exe']);

        bat.stdout.on('data', (data) => {
        console.log(data.toString());
        });

        bat.on('exit', (code) => {
            console.log(`Child exited with code ${code}`);
        });  

        var wind = process.openStdin();

        wind.addListener("data", function(d) {
            bat.stdin.write(d.toString().trim() + '\n') 
        });
    }
    else{
        const bat = spawn('cmd.exe', ['/c',  'cd .\\LiteLoader-' + BDS + '&& SymDB2.exe']);

        bat.stdout.on('data', (data) => {
        console.log(data.toString());
        });

        bat.on('exit', (code) => {
            console.log(`Child exited with code ${code}`);
        });  

        var wind = process.openStdin();

        wind.addListener("data", function(d) {
            bat.stdin.write(d.toString().trim() + '\n') 
        });
    }
}

function unzip(){

    console.log(cyan + 'INFO' + white + ' Start unziping BDS...')
    let bds = new AdmZip('./LiteLoader-' + BDS + '/Bedrock_Server.zip');
    bds.extractAllTo(/*target path*/ './LiteLoader-' + BDS, /*overwrite*/ true);

    console.log(cyan + 'INFO' + white + ' Successfully unzipped BDS')

    console.log(cyan + 'INFO' + white + ' Start unziping LL...')
    let ll = new AdmZip('LiteLoader-' + BDS + '/LiteLoader.zip');
    ll.extractAllTo(/*target path*/ './LiteLoader-' + BDS, /*overwrite*/ true);
    console.log(cyan + 'INFO' + white + ' Successfully unzipped LL')

    console.log(cyan + 'INFO' + white + ' Start deleting BDS...')
    fs.unlink('./LiteLoader-' + BDS + '/Bedrock_Server.zip',err => {
        if(err) console.log(red + 'ERROR' + ' Filed remove BDS')
        else console.log(cyan + 'INFO' + white + ' Successfully deleted BDS')
        gen()
    })
    

    console.log(cyan + 'INFO' + white + ' Start deleting LL...')

    fs.unlink('LiteLoader-' + BDS + '/LiteLoader.zip',err => {
        if(err) console.log(red + 'ERROR' + ' Filed remove LiteLoader')
        else console.log(cyan + 'INFO' + white + ' Successfully deleted LL')
    })
    
}

async function download_ll(){
    console.log(cyan + 'INFO' + white + ' Start downloading LL...')
    await axios({
        method: 'get',
        url: LL_link,
        responseType: 'stream'
    })
    .then(async function (response) {
        await response.data.pipe(fs.createWriteStream('LiteLoader-' + BDS + '/LiteLoader.zip')).on("finish", function(){
            console.log(cyan + 'INFO' + white + ' Successfully downloaded LiteLoader')
            unzip()
        });
    })
    .catch(error => {
        console.error(error);
    });
}

async function download_bds(){
    console.log(cyan + 'INFO' + white + ' Creating dirictory of server...')
    fs.mkdir('LiteLoader-' + BDS, err => {})
    console.log(cyan + 'INFO' + white + ' Start downloading BDS...')
    await axios({
        method: 'get',
        url: 'https://minecraft.azureedge.net/bin-win/bedrock-server-' + BDS + '.zip',
        responseType: 'stream'
    })
    .then(async function (response) {
        await response.data.pipe(fs.createWriteStream('LiteLoader-' + BDS + '/Bedrock_Server.zip')).on("finish", function(){
            console.log(cyan + 'INFO' + white + ' Successfully downloaded BDS')
            download_ll()
        });
        
    })
    .catch(error => {
        console.error(error);
    });
}

function bds(){
    console.log(cyan + 'INFO' + white + ' Getting all BDS versions...')
    axios.get('https://raw.githubusercontent.com/StarsDream00/BDSVersions/main/bds_ver_win.json').then(res => {
    res = JSON.parse(JSON.stringify(res.data))
    let string = ''
    for(let i = 0; i < res.length; i++){
        if(res.length - i == 1){
            string += res[i] + '.'
        }
        else{
            string += res[i]+ ', '
        }
    }
    console.log(cyan + 'INFO' + white + ' It is all BDS versions:')
    console.log(string)
    console.log(cyan + 'INFO' + white + ' Choose one from it and send')

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      })
      nice = false
      readline.question(cyan + 'INFO' + white + ' version > ', (ver) => {
        BDS = ver
        for(let i = 0; i < res.length; i++){
            if(ver == res[i]){
                console.log(cyan + 'INFO' + white + ' You choose ' + BDS + ' version')
                nice = true
                download_bds()
            }
        }
        if(nice == false){
            console.log('Invalid version')
        }
        readline.close()
        
      })

    })
    .catch(error => {
        console.error(error);
    });
}

function main(){
    console.log(cyan + 'INFO' + white + ' Getting all LiteLoader versions...')
    axios.get('https://api.github.com/repos/LiteLDev/LiteLoaderBDS/releases').then(res => {
    res = JSON.parse(JSON.stringify(res.data))
    // console.log(res[2]['assets'][0]['browser_download_url'])
    let string = ''
    for(let i = 0; i < res.length; i++){
        if(res.length - i == 1){
            string += res[i]['tag_name'] + '.'
        }
        else{
            string += res[i]['tag_name'] + ', '
        }
        
    }
    console.log(cyan + 'INFO' + white + ' It is all LiteLoader versions:')
    console.log(string)
    console.log(cyan + 'INFO' + white + ' Choose one from it and send')

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      })
      nice = false
      readline.question(cyan + 'INFO' + white + ' version > ', (ver) => {
        LL = ver
        for(let i = 0; i < res.length; i++){
            if(ver == res[i]['tag_name']){
                console.log(cyan + 'INFO' + white + ' You choose ' + LL + ' version')
                nice = true
                LL_link = res[i]['assets'][0]['browser_download_url']
                LL = res[i]['tag_name']
                bds()
            }
        }
        if(nice == false){
            console.log('Invalid version')
        }
        readline.close()
      })
    })
    .catch(error => {
        console.error(error);
    });
}

main()



