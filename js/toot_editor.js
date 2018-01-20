var $ = jQuery;

$(function(){

	var message = '';

	var template = $('#mastoshare_toot_template');
	var toot = $('#mastoshare_toot');

	var _title = $('#title');
	var _excerpt = $('#excerpt');

	var tags =  $('#post_tag .tagchecklist span');

	var toot_limit_size = toot.attr('maxlength');
	var toot_limit_size_span = $('#toot_limit_size');
	var toot_current_size_span = $('#toot_current_size');
	var final_excerpt = '';
	toot_limit_size_span.text(toot_limit_size);

	function generate_toot(reduce_of) {

		if(reduce_of == undefined)
			reduce_of = 0;

		message = template.val();

		var title = _title.val();
		var excerpt = get_excerpt(reduce_of);
		var permalink = get_permalink();
		var hashtags = get_hashtags();

		var metas = [
			{name: 'title', value: title},
			{name: 'excerpt', value: excerpt},
			{name: 'permalink', value: permalink},
			{name: 'tags', value: hashtags}
		];

		for(var i in metas) {
			var item = metas[i];
			message = message.replace('[' + item.name + ']', item.value);
		}

		if(message.length > toot_limit_size){
			generate_toot(reduce_of - 1);
		}

		toot_current_size_span.text(message.length);
		toot.val(message);

	}

	function get_permalink() {

		var current_path = window.location.href;

		var sample_permalink = $('#sample-permalink').text();
		var editable_post_name =$('#editable-post-name').text();
		var editable_post_name_full = $('#editable-post-name-full').text();

		var permalink = sample_permalink.replace(editable_post_name, editable_post_name_full);

		return permalink;
	}

	function get_excerpt(reduce_of) {

		var content = tinymce.editors.content.getContent({format : 'text'});

		if(typenow != 'page'){

			if(_excerpt.val().length != 0) {
				content = remove_html_tags(_excerpt.val());
			}
		}


		if(reduce_of !==0)
		{

			content = content.split(/(\n|\s)/).slice(0,reduce_of);
			var last_word = content[content.length-1];

			content = content.join('').replace(/(\s|\n)+$/, '') + '...';
		}

		return content;
	}

	function get_hashtags() {
		var tags = $('#tagsdiv-post_tag .tagchecklist span.screen-reader-text');
		var hashtags = '';

		tags.each(function(index, item){
			hashtags+='#' + $(item).text().split(':')[1].trim() + ' ';
		});

		return hashtags.trim();
	}

	function remove_html_tags(string){
		return string.replace(/<(?!\/?>)[^>]*>/gm, '');
	}

	toot.bind('input propertychange', function() {
		toot_current_size_span.text(toot.val().length);
	});

	//Regenerate the toot when title changed
	_title.on('keyup', function() {
		generate_toot();
	});

	//Regenerate the toot when excerpt changed
	_excerpt.on('keyup', function() {
		generate_toot();
	});

	//Regenerate the toot when tags changed
	$('ul.tagchecklist').on('DOMSubtreeModified', function() {
		generate_toot();
	});

	$('#edit-slug-box').on('DOMSubtreeModified', function() {
		generate_toot();
	});

	var watcher = setInterval(function(){

		if(tinymce.activeEditor) {

			//Stop the watcher when activeEditor catched
			clearInterval(watcher);

			//First generation of the toot
			generate_toot();

			//Regenerate the toot when content changed
			tinymce.activeEditor.on('keyup', function(){
                generate_toot();
			});
		}
	}, 1000);

});