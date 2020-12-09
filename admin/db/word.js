const data = [{
    name: 'name',//escape
    translation: 'translation',//escape
    explanation: 'explanation',//JSON.stringify({title:"",desc:"",show:true,})
    wordTypeId: 'wordTypeId',
    tag:"",
    sort:'sort',
    view:0,//查看
    critique:0,//批评
    praise: 0,//赞
    show: true
}]

var a = [];
$('.reference').each(function(){
    $(this).find('tr').each(function(e,i){
        var not = ['data-*',''];
        var name = $(this).find('td:eq(0)').text();
        var translation = $(this).find('td:eq(1)').text();
        if(not.indexOf(name)===-1){
            a.push({
                name: escape($.trim(name.replace(/\(\)/g,'').replace(/New/g,''))),
                translation: escape($.trim(translation.replace(/\。/g,'')) || "无"),
                explanation: '[]',
                wordTypeId: '6127fe145fc8947d00c1b5fa39992cc7',
                tag:"音频视频",
                sort:e+250,
                view:0,//查看
                critique:0,//批评
                praise: 0,//赞
                show: true
            })
        }
    })
})

copy(a)