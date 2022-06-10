var client = io();
var room = window.location.pathname;
var key = false;

$(document).ready(function () {
	$('.message').focus();

	client.emit('join', room);
	client.on('message', function (data) {
		let template = $('#itemTemplate').html();
		let message = data.message.replace(/http(s)*:\/\/[^\s]*/g, '<a href="$&">$&</a>');
		template = template.replace('{{name}}', data.name);
		template = template.replace('{{message}}', message);
		$('.log').append(template);
		$('.log .item-name').each(function () {
			if ($(this).text().match('@')) {
				$(this).css('color', 'red');
			} else if ($(this).text() === 'server') {
				$(this).css('color', 'yellow');
			}
			$(this).css('color', '#' + $(this).text());
		});
		$('.log').scrollTop($('.log').height());
	});

	$('#message').on('keydown', function (e) {
		let message = $(this).text();
		if (e.keyCode === 13 && !e.shiftKey) {
			e.preventDefault();
			$(this).text('');
			if (message.indexOf('/join') === 0) {
				window.location.pathname = '/' + message.split(' ')[1];
			} else {
				if (message.indexOf('/key') === 0) {
					key = message.replace(/\s/g, '-');
				} else {
					client.emit('message', { message, room, key });
				}
			}
		}
	});
});