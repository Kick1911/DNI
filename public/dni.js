(function(){
    function get(path, cb) {
        var xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                cb(this.responseText)
            }
        }
        xhttp.open("GET", path, true)
        xhttp.send()
    }

    function searchTagByText(text, pattern){
        match = text.match('<.*>[^>]*'+pattern+'[^<]*</([a-z]*)>')
        return !!match && match[1]
    }

    function findByText(tag, pattern){
        elements = document.getElementsByTagName(tag)
        for(e of elements){
            if(e.innerHTML.match(pattern)){
                return e
            }
        }
    }

    function keyInString(map, string){
        for(var k in map){
            if(string.includes(k)){
                return k
            }
        }
        return false
    }

    function swap(numbers, map){
        let style = document.head.appendChild(document.createElement("style"))
        for(number of numbers){
            s = searchTagByText(document.body.innerHTML, number)
            target = findByText(s, number)
            keyword = localStorage.getItem('referrer') || keyInString(map[number], document.referrer)
            console.log('Target:', target)
            console.log('Referrer:', document.referrer)
            console.log('Keyword:', keyword)
            if(!(target && keyword))
                continue
            className = 'dni-'+number
            style.innerHTML = '.' + className+'::before {visibility: visible; content: "'+
                target.innerHTML.replace(number, map[number][keyword])+'"} .'+className+' {visibility: hidden}'
            target.classList.add(className)
            localStorage.setItem('referrer', keyword)
        }
    }

    /** MAIN */
    get('http://localhost:5555/user?id=1', function(res){
        res = JSON.parse(res)
        get('http://localhost:5555/map?id=' + res.map, function(map){
            get('http://localhost:5555/numbers?id=' + res.numbers, function(numbers){
                swap(JSON.parse(numbers).list, JSON.parse(map))
            })
        })
    })
})()