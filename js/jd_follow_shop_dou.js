const $ = new Env('关注豆');
var jUrl = $request.url;
var jBody = $request.body;
console.log(jUrl);
console.log(jBody);
var reqBody = getQueryString(jBody, "body");
var clientVersion = getQueryString(jBody, "clientVersion");
var openudid = getQueryString(jBody, "openudid");
var reqSign = getQueryString(jBody, "sign");
var reqSt = getQueryString(jBody, "st");
var reqSv = getQueryString(jBody, "sv");

reqBody = JSON.parse(reqBody);

var notifyText = `https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A0%2C%22shopId%22%3A%22${reqBody.shopId}%22%2C%22activityId%22%3A%22${reqBody.activityId}%22%2C%22sourceRpc%22%3A%22shop_app_home_window%22%2C%22venderId%22%3A%22${reqBody.venderId}%22%7D&client=apple&clientVersion=10.0.9&openudid=c3267405e0e6b11d0a8a2e4963b650d070b3c99c&osVersion=14.4.2&sign=${reqSign}&st=1626659068702&sv=121`
console.log(`\n\n${notifyText}`)

!(async () => {
    if (token) {
        try {
            await update(notifyText)
            $.msg(`获取关注豆`, `获取关注豆成功🎉`, `${notifyText}`)
        } catch (error) {
            $.logErr(error);
        } finally {
            $.done();
        }
    }
})().catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
}).finally(() => {
    $.done();
})

function getQueryString(qStr, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = qStr.match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

function update(body) {
    text = `${body}`
    let opt = {
        url: `https://curly-wave-1a79.iroyway.workers.dev/`,
        body: `text=${text}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 10000,
    };
    return new Promise(resolve => {
        $.post(opt, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                } else {
                    data = JSON.parse(data);
                    if (data.ok) {
                        console.log('Telegram发送通知消息成功🎉。\n')
                    } else if (data.error_code === 400) {
                        console.log('请主动给bot发送一条消息并检查接收用户ID是否正确。\n')
                    } else if (data.error_code === 401) {
                        console.log('Telegram bot token 填写错误。\n')
                    }
                }
            } catch (error) {
                $.logErr(error);
            } finally {
                resolve();
            }
        })
    })
}
