const fs = require('fs');
const file = '/root/.openclaw/workspace/website-maintenance/assets/index-T7eFSBbb.js';
let content = fs.readFileSync(file, 'utf8');

const oldStr = `};/api/oauth/callback\`,t=btoa(e),n=new URL(window.location.origin+"/app-auth");return n.searchParams.set("appId","zuodii-prod"),n.searchParams.set("redirectUri",e),n.searchParams.set("state",t),n.searchParams.set("type","signIn"),n.toString()};`;
const newStr = `};`;

if (content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(file, content);
  console.log('Fixed syntax error!');
} else {
  console.log('String not found!');
}
