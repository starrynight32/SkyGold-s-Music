
"ui";

var color = "#009688";

ui.layout(
    <drawer id="drawer">
        <vertical id="home">
            <appbar>
                <toolbar id="toolbar" title="Sky光遇🎶" />
                <tabs id="tabs" />
            </appbar>
            <list id="music">
                <vertical bg="?selectableItemBackground" w="*">
                    <text textColor="black" textSize="30sp" text="{{this.title}}" layout_gravity="center" />
                    <text textColor="grey" autoLink="all" textSize="10sp" text="{{this.info}}" />
                </vertical>
            </list>
        </vertical>
        <vertical layout_gravity="left" bg="#ffffff" w="280">
            <img w="280" h="200" scaleType="fitXY" src="https://starrynight-32.oss-cn-shenzhen.aliyuncs.com/image/sky.jpg" />
            <list id="menu">
                <horizontal bg="?selectableItemBackground" w="*">
                    <img w="50" h="50" padding="16" src="{{this.icon}}" tint="{{color}}" />
                    <text textColor="black" textSize="10sp" text="{{this.title}}" layout_gravity="center" />
                </horizontal>
            </list>
        </vertical>
    </drawer>
);

//创建选项菜单(右上角)
ui.emitter.on("create_options_menu", menu => {
    menu.add("导入默认音乐");
    menu.add("刷新");
    menu.add("关于");
});
//监听选项菜单点击
ui.emitter.on("options_item_selected", (e, item) => {
    switch (item.getTitle()) {
        case "刷新":
            refresh();
            break;
        case "关于":
            alert("关于", "欢迎使用这个我也没想好该叫什么的东西，目前本软件仅提供卡农（C调）作为尝试，你可以在右上方的多选框中将其添加进你的目录。\n\n    本app不需要使用root权限，你只需要在无障碍（辅助功能）中开启本软件的权限，如果你找不到请善用搜索工具\n\n    当你点击之后需要注意，脚本会自动跳转到光遇游戏中，但是你只有10S的多余时间准备，所以请先换好你的乐器，如果你手速不是很快的话我更推荐你打开弹奏界面，如果你有什么意见或是反馈请到我的个人站点联系我：starrynight.cool\n\n   本app未经本人允许请不要在网络上传播，如果您是在第三方渠道下载的本App希望您能联系我，谢谢");
            break;
        case "导入默认音乐":
            Init();
            break;
    }
    e.consumed = true;
});
activity.setSupportActionBar(ui.toolbar);


ui.toolbar.setupWithDrawer(ui.drawer);

ui.menu.setDataSource([
    {
        title: "设置",
        icon: "@drawable/ic_settings_black_48dp"
    },
    {
        title: "自制新音乐",
        icon: "@drawable/ic_favorite_black_48dp"
    },
    {
        title: "退出",
        icon: "@drawable/ic_exit_to_app_black_48dp"
    }
]);

ui.menu.on("item_click", item => {
    switch (item.title) {
        case "退出":
            ui.finish();
            break;
        case "设置":
            toast("暂未开放");
            break;
        case "自制新音乐":
            alert("研发中..", "  你可以通过新建一个文本文件，并以1-F标识从左到右从上到下的15个音，用0表示空音符，并在开头用最多3位数字（可以不用前位补零）表示每个音之间要空出多少毫秒，在后跟上一个空格用以正式开始乐谱,如:\n\n  ‘044 AA’就代表每个音之间有44ms的第二行最后一个键弹两次。\n\n    如果有多个音同时出现请以类似‘044 AA 88’表示，在中间加一个空格，这表示044节拍的A+8按两下，并将其保存在/sdcard/skymusic目录下。\n\n   目前最多支持五个音同时出现，可以参考目录中《卡农》格式，或关注后续更新");
            break;
    }
});

refresh();

var dir = "/sdcard/skymusic/";
files.ensureDir(dir);
var txtFiles = files.listDir(dir);

function refresh() {    //刷新页面
    dir = "/sdcard/skymusic/";
    files.ensureDir(dir);
    txtFiles = files.listDir(dir, function (name) {
        return name.endsWith(".sgm") && files.isFile(files.join(dir, name));
    });
    
    var len = txtFiles.length;
    var Items = [];
    for (i = 0; i < len; i++) {
        var Info = "";
        var str = files.read(dir + txtFiles[i]);
        for (j = 0; j < 300; j++) {
            if (str[j] == " ") {
                break;
            } else {
                Info = Info + str[j];
            }
        }
        log(Info);
        Items.splice(1, 0, { title: txtFiles[i], info: Info });
    }
    ui.music.setDataSource(Items);
}

ui.music.on("item_click", item => {
    switch (item.title) {
        default:
            Music(item.title);
    }
});

ui.music.on("item_longClick", item => {
    switch (item.title) {
        default:
            log("长按" + item.title);
            alert(item.info);
    }
});

function Init() {
    var canon = "谱来自:\nhttps://www.bilibili.com/video/BV1M4411F7jy 160 1000000020000000100000003000000010000000100000001000000020000000100000002000400010000000300050001000000010001000100000002000400010708030200050401000A08030A0C0D010A090B010908070105040002000807010703030200020401000308030A050D010A010B010901070105040002005789710ABC0AB256789AB3089A0341654587810876054143456781087807826789ABC10ABC0AB256789AB3056730416541878108710541434167810871078767898678 5000000050000000300000005000000040000000300000004000000050000000300000005000000030000000500000004000000030000000400000005000000030000000500070003000000070000000600000005000000040000000500000003000500050005000300060007000700060004000500030004000000050000000500000007000000060000000300000004000000020000000400000005000000050005000C00020006000600030003000400040003000300040004000200020001 80000000700000006000000070000000600000005000000060000000700000008000000070000000600000007000000060000000500000006000000070000000800000000000000060000000C0000000B0000000A0000000600000008000000080008000000070006000A000C000C000B0009000A00080006000000080000000A0000000C0000000A00000005000000060000000500000006000000070000000A000B00000000000A000A00050005000600060005000500060008000500050002 A000000090000000800000000000000000000000000000000000000000000000A00000009000000080000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000C000000000000000000000000000000000000000000000000000000000000000C0000000000000000000000000000000000000000000000000000000000000000";
    files.write("/sdcard/skymusic/卡农.sgm", canon);
    refresh();
    toast("点击即可使用");
}

function Music(file) {
    var M = files.read(files.join(dir, file));
    var num = 0;
    for (i = 0; i < M.length; i++) {
        if (M[i] == " ") {
            num++;
        }
    }
    switch (num) {
        default:
            alert("错误", "该文件并不符合本软件要求，如果是您自制的话可能是没有设置节拍");
            break;
        case 2:
            var thread = threads.start(function () {
                Click(file);
            });
            break;
        case 3:
            var thread = threads.start(function () {
                twoClick(file);
            });
            break;
        case 4:
            var thread = threads.start(function () {
                threeClick(file);
            });
            break;
        case 5:
            var thread = threads.start(function () {
                fourClick(file);
            });
            break;
        case 6:
            var thread = threads.start(function () {
                fiveClick(file);
            });
    }

}

function Click(file) {
    var M = files.read(files.join(dir, file));
    var m = M.split(" ");
    speed = Number(m[1]);
    m1 = m[2];
    toast("10S后将开始演奏");
    app.launchPackage("com.netease.sky");
    sleep(1000 * 5);
    toast("还有5秒");
    sleep(1000 * 5);
    toast("演出开始~");
    for (i = 0; i < m1.length; i++) {
        click(getX(m1[i]), getY(m1[i]));
        sleep(speed);
    }
}

function twoClick(file) {
    var M = files.read(files.join(dir, file));
    var m = M.split(" ");
    speed = Number(m[1]);
    m1 = m[2];
    m2 = m[3];
    toast("10S后将开始演奏");
    app.launchPackage("com.netease.sky");
    sleep(1000 * 5);
    toast("还有5秒");
    sleep(1000 * 5);
    toast("演出开始~");
    for (i = 0; i < m1.length; i++) {
        gestures([1, [getX(m1[i]), getY(m1[i])]],
            [1, [getX(m2[i]), getY(m2[i])]]);
        sleep(speed);
    }
    toast("演出结束~")
}

function threeClick(file) {
    var M = files.read(files.join(dir, file));
    var m = M.split(" ");
    speed = Number(m[1]);
    m1 = m[2];
    m2 = m[3];
    m3 = m[4];
    toast("10S后将开始演奏");
    app.launchPackage("com.netease.sky");
    sleep(1000 * 5);
    toast("还有5秒");
    sleep(1000 * 5);
    toast("演出开始~");
    for (i = 0; i < m1.length; i++) {
        gestures([1, [getX(m1[i]), getY(m1[i])]],
            [1, [getX(m2[i]), getY(m2[i])]],
            [1, [getX(m3[i]), getY(m3[i])]]);
        sleep(speed);
    }
    toast("演出结束~")
}

function fourClick(file) {
    var M = files.read(files.join(dir, file));
    var m = M.split(" ");
    speed = Number(m[1]);
    m1 = m[2];
    m2 = m[3];
    m3 = m[4];
    m4 = m[5];
    toast("10S后将开始演奏");
    app.launchPackage("com.netease.sky");
    sleep(1000 * 5);
    toast("还有5秒");
    sleep(1000 * 5);
    toast("演出开始~");
    for (i = 0; i < m1.length; i++) {
        gestures([1, [getX(m1[i]), getY(m1[i])]],
            [1, [getX(m2[i]), getY(m2[i])]],
            [1, [getX(m3[i]), getY(m3[i])]],
            [1, [getX(m4[i]), getY(m4[i])]]);
        sleep(speed);
    }
    toast("演出结束~")
}

function fiveClick(file) {
    var M = files.read(files.join(dir, file));
    var m = M.split(" ");
    speed = Number(m[1]);
    m1 = m[2];
    m2 = m[3];
    m3 = m[4];
    m4 = m[5];
    m5 = m[6];
    toast("10S后将开始演奏");
    app.launchPackage("com.netease.sky");
    sleep(1000 * 5);
    toast("还有5秒");
    sleep(1000 * 5);
    toast("演出开始~");
    for (i = 0; i < m1.length; i++) {
        gestures([1, [getX(m1[i]), getY(m1[i])]],
            [1, [getX(m2[i]), getY(m2[i])]],
            [1, [getX(m3[i]), getY(m3[i])]],
            [1, [getX(m4[i]), getY(m4[i])]],
            [1, [getX(m5[i]), getY(m5[i])]]);
        sleep(speed);
    }
    toast("演出结束~")
}

function getY(p) {   //获取对应Y坐标
    switch (p) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
            return 200;
            break;
        case '6':
        case '7':
        case '8':
        case '9':
        case 'A':
            return 400;
            break;
        case 'B':
        case 'C':
        case 'D':
        case 'E':
        case 'F':
            return 600;
            break;
        default:
            return 0;
    }
}

function getX(p) {   //获取对应X坐标
    switch (p) {
        case '1':
        case '6':
        case 'B':
            return 700;
            break;
        case '2':
        case '7':
        case 'C':
            return 900;
            break;
        case '3':
        case '8':
        case 'D':
            return 1100;
            break;
        case '4':
        case '9':
        case 'E':
            return 1300;
            break;
        case '5':
        case 'A':
        case 'F':
            return 1500;
            break;
        default:
            return 0;
    }
}