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
$('.notranslate tr').each(function(e,i){
    var not = ['data-*',''];
    var name = $(this).find('td:eq(0)').find('a').text();
    var translation = $(this).find('td:eq(1)').text();
    if(not.indexOf(name)===-1){
        a.push({
            name: escape(name.replace(/\</g,'').replace(/\>/g,'')),
            translation: escape(translation.replace(/\。/g,'')),
            explanation: '[]',
            wordTypeId: '6127fe145fc8947d00c1b5fa39992cc7',
            tag:"全局属性",
            sort:e+115,
            view:0,//查看
            critique:0,//批评
            praise: 0,//赞
            show: true
        })
    }
})