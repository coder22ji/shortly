$(document).ready(function () {

    const linkForm = $("#link-form");
    $(".hamburger").click(() => {
        $(".hamburger").toggleClass("open")
        $("#menu").toggleClass("hidden")
    })



    function isUrl(s) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return regexp.test(s);
    }
    var linksObj = {
        short: [],
        long: []
    }
    if (sessionStorage.getItem('links') !== null) {

        let getLinks = JSON.parse(sessionStorage.getItem('links'));
        for (var i = 0; i < getLinks.short.length; i++) {
            $('#links').append(`<div
                class="flex flex-col items-center flex-wrap justify-between w-full p-6 bg-white rounded-lg md:flex-row space-y-2 md:space-y-0">
                <p
                    class="font-bold text-sm md:text-base text-center text-sm md:text-base text-veryDarkVoilet md:text-left">
                        ` + getLinks.long[i] + `
                    </p>
        
                <div
                    class="flex flex-col items-center justify-end flex-1 space-x-4 space-y-2 md:flex-row md:space-y-0">
                    <div class="font-bold text-cyan btn-text">` + getLinks.short[i] + `</div>
                    <button
                        class="bg-cyan btn-click text-white px-6 py-2 rounded-md hover:bg-cyanLight focus:outline-none">Copy</button>
                </div>
            </div>`)

        }
    } else {
        console.log('hello')
    }


    linkForm.submit((e) => {

        e.preventDefault();
        //longURL = e.target.inputLink.value;
        if (e.target.inputLink.value === "") {
            //console.log("empty");
            $("#link-input").addClass("border-red");
            $("#err-msg").html("please paste link")
        } else if (!isUrl(e.target.inputLink.value)) {
            $("#err-msg").html("please paste correct URL ")
            $("#link-input").addClass("border-red");
        } else {
            $("#err-msg").html("")
            $("#link-input").removeClass("border-red");
            fetch('https://api-ssl.bitly.com/v4/shorten', {
                method: 'POST',
                headers: {
                    'Authorization': '20f71840f47b53991373e15826eb4c4efede969a',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "long_url": e.target.inputLink.value,
                    "domain": "bit.ly",
                    "group_guid": "Bm787knlrVk"
                })
            }).then(res => res.json()).then((data) => {
                linksObj.short.push(data.link);
                //console.log(data.long_url)
                linksObj.long.push(data.long_url);
                sessionStorage.setItem('links', JSON.stringify(linksObj));
                $('#links').append(`<div
                    class="flex flex-col items-center flex-wrap justify-between w-full p-6 bg-white rounded-lg md:flex-row space-y-2 md:space-y-0">
                    <p
                        class="font-bold text-sm md:text-base text-center text-sm md:text-base text-veryDarkVoilet md:text-left">
                            ` + data.long_url + `
                        </p>
            
                    <div
                        class="flex flex-col items-center justify-end flex-1 space-x-4 space-y-2 md:flex-row md:space-y-0">
                        <div class="font-bold text-cyan btn-text">` + data.link + `</div>
                        <button
                            class="bg-cyan text-white px-6 py-2 rounded-md hover:bg-cyanLight focus:outline-none">Copy</button>
                    </div>
                </div>`)
            });
        }

    })

    $('#links').find('button').on("click",(e) => { 
        var copyText = $(e.target).prev('div').text();
        console.log(copyText)
        navigator.clipboard.writeText(copyText).then(() => {

            //alert("Copied to clipboard");
        });
    })

});