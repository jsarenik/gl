(function ($) {
	
    $.ajaxSetup({cache: false});
    
	// enable the tooltips
	if($('body').hasClass('enable-tooltips')) {
		$('[data-tooltip]').each(function() {
			var $t = $(this);
			$t.data('toggle', 'tooltip').data('placement', 'bottom').data('title', $t.data('tooltip'));
			$t.tooltip();
		});
	}
	
    $(document).ready(function() {
		
		$('#menu-toggle').click(function() {
			$('header').toggleClass('menu-open');
		});
		
		$('.song-preview-toggle').click(function() {
			var $preview = $(this).closest('.song-preview');
			if($preview.hasClass('open')) {
				$preview.removeClass('open');
			} else {
				var $more = $preview.find('.song-preview-more');
				if($more.length>0 && $more.data('load')) {
					$more.html($more.data('load'));
					$more.data('load', false);
				}
				$preview.addClass('open');
			}
		});
        
		$('.lister-filter').each(function() {
			
			var $filter = $(this);
			$filter.find('select').change(function(){
				$filter.submit();
			});
			
		});
		
		$('.slideshow').each(function() {
			var $slideshow = $(this);
			$slideshow.find('ul').bxSlider({
				auto: true,
				mode: 'fade',
				speed: 1000,
				pause: 8000,
				controls: true,
				autoControls: false,
				pager: false,
				prevText: '◄',
				nextText: '►',
				startText: '►',
				stopText: '❚❚',
				onSliderLoad: function() {
					$slideshow.find('li>img').css('display', 'block');
				}
			});
		});
		
		$('.sortable-list').each(function() {
			
			var $list = $(this);
			var axis = $list.data('sortable-axis') || 'y';
			var handle = $list.find('.sortable-handle').length>0 ? '.sortable-handle' : null;
			
			$list.sortable({
				axis: axis,
				handle: handle,
				update: function() {
					$list.trigger('sorted');
				}
			});
			
			$list.find('.btn-sort-up').click(function() {
				var $item = $(this).closest('.sortable-item');
				var $prev = $item.prev();
				if($prev.length===0) return;
				$prev.before($item);
				$list.trigger('sorted');
			});
			
			$list.find('.btn-sort-down').click(function() {
				var $item = $(this).closest('.sortable-item');
				var $next = $item.next();
				if($next.length===0) return;
				$next.after($item);
				$list.trigger('sorted');
			});
			
		});
		
		$('.custom-file-group').each(function() {
			var $wrapper = $(this);
			var $input = $wrapper.find('.custom-file-input');
			var $label = $wrapper.find('.custom-file-label');
			var $clear = $wrapper.find('.btn-clear-file');
			var originalLabel = $label.html();
			$input.change(function(e){
				if(e.target.files.length===0) {
					$label.html(originalLabel);
					$clear.hide();
				} else {
					$label.text(e.target.files[0].name);
					$clear.show();
				}
			});
			$clear.hide();
			$clear.click(function() {
				$input.val('').change();
			});
		});
		
		PlayerStation.Init();
		Collector.Init();
		
    });
	
}) (jQuery);

var Collector = {
	
	FileIds: [],
	MaxFiles: 20,
	
	Init: function() {
		
		// collector box
		var $col = $('#collector');
		Collector.MaxFiles = parseInt($col.data('max-files'));
		if(isNaN(Collector.MaxFiles)) Collector.MaxFiles = 20;
		var test = $col.data('file-ids') + '';
		if(test!=='') {
			var ids = test.split(',');
			for(var i in ids) {
				var id = parseInt(ids[i]);
				if(isNaN(id)) continue;
				Collector.FileIds.push(id);
				Collector._UpdateButtons(id, true);
			}
		}
		Collector._UpdateAmount();
		$col.click(function(e) {
			if(Collector.FileIds.length===0) {
				alert($col.data('hint'));
				e.preventDefault();
			}
		});
		
		// collect buttons
		$('.btn-collect-file').each(function() {
			var $btn = $(this);
			var id = parseInt($btn.data('file-id'));
			$btn.click(function(e) {
				if($btn.hasClass('is-collected')) {
					Collector.RemoveItem(id);
				} else {
					Collector.AddItem(id);
				}
				$btn.blur();
				e.preventDefault();
			});
		});
		
		// files list
		$('.collector-file').each(function() {
			var $file = $(this);
			var id = parseInt($file.data('file-id'));
			$file.find('.btn-collector-remove').click(function() {
				var $btn = $(this);
				Collector.RemoveItem(id);
				$btn.blur();
				$file.slideUp(function() {
					$file.remove();
					var rest = $('.collector-file').length;
					if(rest===0) {
						$('#collector-nofiles').show();
						$('#collector-controls').remove();
					} else if(rest===1) {
						$('.col-sorters').remove();
					}
					Collector._UpdateList();
				});
			});
		});
		$('.collector-files').on('sorted', function() {
			Collector._UpdateList();
			Collector.FileIds = [];
			$('.collector-file').each(function() {
				var id = parseInt($(this).data('file-id'));
				Collector.FileIds.push(id);
			});
			Collector._Ajax({sort: Collector.FileIds.join(',')});
		});
		
		// download form
		var $form = $('#collector-form');
		if($form.length>0) {
			
			$('.collector-options-group').each(function() {
				var $group = $(this);
				var $radios = $group.find('.collector-option');
				$radios.change(function() {
					var $radio = $(this);
					$radios.not($radio).each(function() {
						var target = $(this).data('target');
						if(!target) return;
						$(target).slideUp();
					});
					var target = $radio.data('target');
					if(target) $(target).slideDown();
					if($('.collector-option[data-is-upload="true"]:checked').length>0) {
						$('#UploadFileInfo').slideDown();
					} else {
						$('#UploadFileInfo').slideUp();
					}
				});
			});
			
			$form.submit(function(e) {
				$('#collector-form-file-ids').val(Collector.FileIds.join(','));
				var cancel = false;
				var max = parseInt($form.data('max-file-size'));
				$form.find('input[type="file"]').each(function() {
					var $input = $(this);
					var fn = $input.val();
					if(!fn) return;
					var ext = fn.split('.').pop().toLowerCase();
					if(ext!=='pdf') {
						alert('Es dürfen nur PDF-Dateien ausgewählt werden.');
						cancel = true;
					}
					if(this.files) {
						var f = this.files[0];
						if (f && (f.size > max || f.fileSize > max)) {
							alert('Die Datei ist zu groß.');
							cancel = true;
						}
					}
				});
				if(cancel) e.preventDefault();
			});
			
		}
		
	},
	
	AddItem: function(id) {
		if(Collector.FileIds.indexOf(id)>-1) return;
		if(Collector.FileIds.length + 1 > Collector.MaxFiles) {
			alert($('#collector').data('max-files-hint'));
			return;
		}
		Collector.FileIds.push(id);
		Collector._UpdateButtons(id, true);
		Collector._UpdateAmount();
		Collector._Ajax({add: id});
	},
	
	RemoveItem: function(id) {
		var index = Collector.FileIds.indexOf(id);
		if(index===-1) return;
		Collector.FileIds.splice(index, 1);
		Collector._UpdateButtons(id, false);
		Collector._UpdateAmount();
		Collector._Ajax({remove: id});
	},
	
	_UpdateButtons: function(id, collected) {
		$btn = $('.btn-collect-file[data-file-id="' + id + '"]');
		if(collected) {
			$btn.addClass('is-collected btn-light').addClass('btn-gray-light');
		} else {
			$btn.removeClass('is-collected btn-gray-light').addClass('btn-light');
		}
	},
	
	_UpdateAmount: function() {
		
		var count = Collector.FileIds.length;
		
		var $col = $('#collector');
		var $count = $col.find('.collector-count > span');
		$count.text(count);
		
		if(count>0) {
			$col.addClass('has-items');
		} else {
			$col.removeClass('has-items');
		}
		
	},
	
	_Ajax: function(params) {
		$.ajax({
			url: $('html').data('base-url') + 'collector/ajax',
			type: 'POST',
			data: params,
			success: function() { }
		});
	},
	
	_UpdateList: function() {
		var no = 0;
		$('.collector-file').each(function() {
			no++;
			$(this).find('.col-number').text(no);
		});
	}
	
};

var PlayerStation = {
	
	Init: function() {
		MiniPlayer.Init();
		MultiPlayer.Init();
	},
	
	StopAll: function() {
		MultiPlayer.StopAll();
		MiniPlayer.StopAll();
	}
	
};

var MiniPlayer = {
	
	Init: function() {
		$('.mini-player').each(function() {
			MiniPlayer.InitPlayer($(this));
		});		
	},
	
	InitPlayer: function($player) {
		
		var $btn = $player.find('button');
		var audio = $player.find('audio').get(0);
		
		$btn.click(function(e) {
			MiniPlayer.Toggle($player);
			$btn.blur();
			e.preventDefault();
		});
		
		audio.addEventListener('ended', function() {
			MiniPlayer.Stop($player);
		});
		
	},
	
	Toggle: function($player) {
		var $btn = $player.find('button');
		var $icon = $btn.find('.icon');
		if($icon.hasClass('icon-pause')) {
			MiniPlayer.Stop($player);
		} else {
			MiniPlayer.Play($player);
		}
	},
	
	Play: function($player) {
		
		var $btn = $player.find('button');
		var $icon = $btn.find('.icon');
		if($icon.hasClass('icon-pause')) return;
		
		PlayerStation.StopAll();
		
		$icon.removeClass('icon-play').addClass('icon-pause');
		var playingClass = $player.data('class-playing');
		var stoppedClass = $player.data('class-stopped');
		if(playingClass) $btn.removeClass(stoppedClass).addClass(playingClass);
		
		var audio = $player.find('audio').get(0);
		audio.play();
		
	},
	
	Stop: function($player) {
		
		var $btn = $player.find('button');
		var $icon = $btn.find('.icon');
		if($icon.hasClass('icon-play')) return;
		
		$icon.removeClass('icon-pause').addClass('icon-play');
		var playingClass = $player.data('class-playing');
		var stoppedClass = $player.data('class-stopped');
		if(playingClass) $btn.removeClass(playingClass).addClass(stoppedClass);
		
		var audio = $player.find('audio').get(0);
		audio.pause();
		
	},
	
	StopAll: function() {
		$('.mini-player').each(function() {
			MiniPlayer.Stop($(this));
		});
	}
	
};

var MultiPlayer = {
	
	Init: function() {
		$('.multi-player').each(function() {
			MultiPlayer.InitPlayer($(this));
		});
	},
	
	InitPlayer: function($player) {
		
		var $files = $player.find('.multi-player-files > li > a');
		var audio = $player.find('audio').get(0);
		var $btn = $player.find('button');
		
		$btn.click(function() {
			MultiPlayer.Toggle($player);
			$btn.blur();
		});
		
		$files.click(function(e) {
			e.preventDefault();
			MultiPlayer.PlayFile($player, $(this));
		});
		
		audio.addEventListener('ended', function() {
			var $next = $files.closest('.multi-player-files').find('.active').next();
			if($next.length===0) {
				MultiPlayer.Stop($player);
			} else {
				MultiPlayer.PlayFile($player, $next.children().eq(0));
			}
		});
		
	},
	
	Toggle: function($player) {
		var $btn = $player.find('button');
		var $icon = $btn.find('.icon');
		if($icon.hasClass('icon-pause')) {
			MultiPlayer.Stop($player);
		} else {
			var $file = $player.find('.multi-player-files > li.active > a');
			MultiPlayer.PlayFile($player, $file);
		}
	},
	
	PlayFile: function($player, $file) {
		
		var $btn = $player.find('button');
		var $icon = $btn.find('.icon');
		var audio = $player.find('audio').get(0);
		var src = $file.prop('href');
		
		if($icon.hasClass('icon-pause') && audio.src===src) return;
		
		// temporarily reset icon so that we don't get stopped when calling PlayerStation.StopAll()
		$icon.removeClass('icon-pause').addClass('icon-play');
		PlayerStation.StopAll();
		
		$icon.removeClass('icon-play').addClass('icon-pause');
		var playingClass = $player.data('class-playing');
		var stoppedClass = $player.data('class-stopped');
		if(playingClass) $btn.removeClass(stoppedClass).addClass(playingClass);
		
		if(audio.src!==src) {
			audio.src = src;
			audio.load();
		}
		audio.play();
		
		$file.parent().addClass('active').siblings().removeClass('active');
		$file.blur();
		
	},
	
	Stop: function($player) {
		
		var $btn = $player.find('button');
		var $icon = $btn.find('.icon');
		if($icon.hasClass('icon-play')) return;
		
		$icon.removeClass('icon-pause').addClass('icon-play');
		var playingClass = $player.data('class-playing');
		var stoppedClass = $player.data('class-stopped');
		if(playingClass) $btn.removeClass(playingClass).addClass(stoppedClass);
		
		var audio = $player.find('audio').get(0);
		audio.pause();
		
	},
	
	StopAll: function() {
		$('.multi-player').each(function() {
			MultiPlayer.Stop($(this));
		});
	}
	
};
