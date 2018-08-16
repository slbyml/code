## vue双向数据绑定
```
<div id="app">
    <input type="test" v-model="input"><button v-on:click="changeInput">更改输入框</button>   输入框的值为:{{input}}
    <h1>{{song}}</h1>
    <!-- <p>《{{album.name}}》是{{singer}}2005年11月发行的专辑</p> -->
    <p>主打歌为{{album.theme}}</p>
    <p>作词人为{{singer}}等人。</p>
    为你弹奏肖邦的{{album.theme}}    
</div>
<script src="dist/main.js"></script>
<script>
    var myvue=new MVVM({
        el:"#app",
        data:{            
            song: '发如雪-Song',
            album: {
                name: '十一月的萧邦-肖邦',
                theme: '夜曲123'
            },
            singer: '周杰伦-singer',
            input: "input"
        },
        methods: {
            changeInput() {
                this.input = +new Date()
            }
        }
    })
</script>
```
流程：

![img1](assets/1.png)

Compile：

![img2](assets/2.png)

