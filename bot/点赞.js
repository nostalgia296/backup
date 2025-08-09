let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

async function sub(id, times, count) {
    try {
        // 获取信息
        const infoResponse = await fetch("http://localhost:3000/get_stranger_info", {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({ "user_id": id })
        });
        const infoResult = await infoResponse.json();
       //提示 
        if (infoResult.status !== "ok") throw new Error("获取信息失败");
        console.log(`开始为${infoResult.data.nick}(${id})点赞，总次数${times * count}`);

        if (times > 10) return console.log("一次最多点10个！");
        if (count > 5) return console.log("最多执行5次！");

        // 循环发送点赞请求
        for (let i = 0; i < count; i++) {
            const likeResponse = await fetch("http://localhost:3000/send_like", {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({ "user_id": id, "times": times })
            });
            const likeResult = await likeResponse.json();
            
            console.log(likeResult.message?.indexOf("失败") <=0 ?"点赞成功":likeResult.message);
        }
    } catch (error) {
        console.error('请求出错:', error);
    }
}


(async () => {
    await sub("xxxxx", 10, 5); 
    //await sub("xxxx", 10, 5); 
    await sub("xxxx", 10, 5); 
})();
