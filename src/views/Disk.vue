<template lang="pug">
.disk
  el-row(type="flex")
    el-button(type="primary",@click='upload') 上传
    el-button(@click='createFolder') 新建文件夹
  el-row(type="flex")
    el-col(v-bind:span='4')
      el-button(type='text',@click='backFileList',icon='arrow-left') BACK
    el-col.filebread(v-bind:span='12')
      el-breadcrumb(separator=">",v-bind:replace='true')
        el-breadcrumb-item(v-for='p in _getBreadCrumb()',v-bind:to="{query:{path:p.path}}",key = 'p')
          | {{p.name}}
    el-col.filebread(v-bind:span='4')
      span Total: {{filescount}}
  el-row.frame-main(type="flex")
    transition
      router-view(v-loading='isLoading')
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'webdisk',
  data () {
    return {
      isrootpath:true,
      filescount:0,
      isLoading:false,
      playersrc:'',
    }
  },
  computed:{
    ...mapGetters ({
      uk:'uk',
      deletePath: 'deletePath',
      downloadfiles:'downfiles',
      downfilesM4s:'downfilesM4s',
      share2squareItems:'share2squareItems',
      videofile:'videofile',
    })
  },
  methods:{
    _getBreadCrumb:function(){
      let path = this.utils.pathmanager().pathSegmtt();
      return path;
    },
    goFileList:function(){
      const path = this.utils.pathmanager().getPath()
      this.downlinks = [];
      this.isLoading = true;
      const token = sessionStorage.getItem('accessToken');
	    this.$restAPI.filelist(token,this.uk,path)
      .then(list=>{
        this.filescount = list.length;
        this.$store.dispatch('filelist',list);
        this.isLoading = false;
      })
      .catch((e)=>{
        this.isLoading = false;
        if(e.message.indexOf('代码 -9') > 0)
            {this.$router.push({path:"/disk",query:{path:'/'}})}
        else{this.$message.error(e.message)}
        });
    },
    deleteFile:function(){
      const token = sessionStorage.getItem('accessToken');
	    this.$restAPI.deletefile(token,this.uk,this.deletePath)
       .then((data)=>{
        this.$message({type: 'success',
            message: '删除成功!' });
        this.goFileList();
       })
       .catch((e)=>{this.$message.error('删除失败。')});
    },
    downFromM4s:function(){
       this.$restAPI.zqdownfiles(this.downfilesM4s)
       .then((data)=>{
         if(data!='error'){
           this.$message({
             message: '恭喜！发送成功~快去看看吧！',type: 'success'});
         }else{
           this.$message.error('阿哦，发送失败。。大侠请重新来过。');
         }
       })
       .catch((e)=>{
        this.$message.error('阿哦，出错了诶？是不是没有打开坐骑呢?')});
    },
    downfiles:function(){
      this.isLoading = true;
      const token = sessionStorage.getItem('accessToken');
	    this.$restAPI.downfiles(token,this.uk,[this.downloadfiles])
      .then(data=>{
        if(data.links){this.$restAPI.vertifyco(data.cookies,true);
          return data.links
        }else{throw new Error(data.message)}
      })
      .then(linksObj=>{
        this.isLoading = false;
        this.$store.dispatch('showdownlinks',linksObj);
      })
      .catch((e)=>{
        this.isLoading = false;
        this.$message.error(e.message)});
    },
    showvideo:function(){
      this.isLoading = true;
      const token = sessionStorage.getItem('accessToken');
      this.$restAPI.downfiles(token,this.uk,[this.videofile])
      .then(data=>{
        if(data.links){return data.links}
        else{throw new Error(data.message)}
      })
      .then(links=>{
        this.isLoading = false;
        for(let key in links){this.playersrc= links[key][0];}
        // console.log(this.playersrc);
      }).catch(e=>this.isLoading = false);
    },
    backFileList:function(){
      const pm = this.utils.pathmanager()
      let cur = pm.getBackPath();
      this.$router.push({query:{path:cur}});
    },
    upload:function(){
      this.$message('开发中。。。欢迎提出改进意见~');
    },
    createFolder:function(){
      this.$prompt('请输入文件夹名称', '新建文件夹', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          const path = this.utils.pathmanager().getPath() +'/' + value;
          const token = sessionStorage.getItem('accessToken');
          this.$restAPI.createFolder(token,this.uk,path)
          .then(data=>{
            this.$message.success('创建成功!');
            this.goFileList();
          });
        }).catch((e)=>{});
    },
    add2square:function(){
      const item = this.share2squareItems;
      const token = sessionStorage.getItem('accessToken');
      this.$squareAPI.add2square(token, item.file, item.msg)
      .then(msg=>{
        this.$message.success(msg);
      });
    },
  },
  watch: {
    videoDL(){
      if(!this.videoDL){this.playersrc = '';}
    },
    uk(){
      this.goFileList();
    },
    deletePath(){
      this.deleteFile();
    },
    downloadfiles(){
      this.downfiles();
    },
    downfilesM4s(){
      this.downFromM4s();
    },
    share2squareItems(){
      this.add2square();
    },
    videofile(){
      this.showvideo();
    },
    "$route": "goFileList"
  }
}
</script>

<style scoped lang="scss">
.disk{
  top: 0px;
  bottom: 0px;
  height: 100%;
  width: 100%;
  .filebread{
    padding-top: 10px
  }
  .frame-main{
    flex:1;
  }
}
</style>