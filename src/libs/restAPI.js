import axios from 'axios';
import MD5 from './cryptos.js';

class M4API{
  constructor() {
    this.$ajax = axios.create({
      baseURL: 'http://api.pescn.top/',
      headers: {}
    });
  }
  signup(username,password) {
    const url="/signup";
    return this.$ajax({
      method: 'POST',
      url: url,
      params: { "security": "md5" },
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`
        }
        return ret
      }],
      data: {
        "name": encodeURIComponent(username),
        "password": MD5(password).toString()
      }
    })
    .then(response =>response.data).then(data=>data.message)
    .catch(err=>{let msg = '';
      if(err.response){msg = err.response.data.message}
        else{msg=err.message;}
      throw msg;
    });
  }
  login(username,password) {
    const url="/login";
    return this.$ajax({
      method: 'POST',
      url: url,
      params: { "security": "md5" },
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`
        }
        return ret
      }],
      data: {
        "name": encodeURIComponent(username),
        "password": MD5(password).toString()
      }
    })
    .then(response =>response.data)
    .then(data=>{
      if(data.errno!=0) {throw new Error(data.message)}
      return data.token;
    })
    .catch(err=>{let msg = '';
      if(err.response){msg = err.response.data.message}
        else{msg=err.message}
      throw msg;
    });
  }
  _userinfo(token,uk) {
    const url='/userinfo';
    return this.$ajax({
      method:'GET',url:url,
      params:{token:token, uk:uk} 
    })
    .then(data => {
      data = data.data;
      let info = {}
      info.uk = uk;
      info.Name = data.username;
      info.nick_name = data.nick_name;
      info.total = data.total;
      info.free = data.free;
      info.used = data.used;
      return info;
    })
  }
  userlist(token) {
    const url='/userlist';
    return this.$ajax({
      method: 'GET',
      url: url,
      params: { token: token }
    })
    .then(response =>response.data)
    .then(data => {
      data.userlist.map(item => {
        item.Name = unescape(item.Name.replace(/\\u/g, "%u"));
        item.Token = token;
        })
      return data.userlist;
    })
    .then(list => list.map(item => this._userinfo(token,item.Uk)))
    .catch(err => {let msg = '';
      if(err.response){msg = err.response.data.message}
        else{msg=err.message;}
      throw msg;
    });
  }
  filelist(token,uk,path) {
    const url='/filelist';
    return this.$ajax({
      method: 'GET',
      url: url,
      params: {
        token: token,
        uk: uk,
        path: encodeURIComponent(path)
      }
    })
    .then(response =>response.data.list)
    .catch(err=>{let msg = '';
      if(err.response){msg = err.response.data.message}
        else{msg=err.message}
      throw msg;
    });
  }
  downfiles(token, uk, files) {
    const url = '/filelinks';
    const FILESIZE_30M = 30*1024*1024;
    const method = "APPID";// file.size>FILESIZE_30M ? "DEFAULT" : "APPID";
    let file = {
      "path":encodeURIComponent(files.path),
      "id": files.fs_id
    };
    return this.$ajax({
      method: 'POST',
      url: url,
      params: {
        token: token,
        uk: uk,
        method: method
      },
      transformRequest: [function (data) {
        let ret = '';
        for (let it in data) { ret += `${it}=${data[it]}` }
        return ret;
      }],
      data: {
        "files": `[${JSON.stringify(file)}]`
      }
    })
    .then(response => response.data.links)
    .catch(err=>{let msg = '';
      if(err.response){msg = err.response.data.message}
        else{msg=err.message}
      throw msg;
    });
  }
}

export default M4API;