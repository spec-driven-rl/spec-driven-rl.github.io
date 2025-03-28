$(document).ready(function() {

    var codegen_html_template = `
    <p>Prediction set, human help, executed action:</p>
    <pre class="codegen"><code class="language-python">{code}</code></pre>`;
        $('[id^="code_"]').each(function() {
            var id = this.id;
            domain_name_cmd_idx = id.substring(5);
            var sep_idx = domain_name_cmd_idx.indexOf('_');
            var domain_name = domain_name_cmd_idx.substring(0, sep_idx);
            var cmd_idx_str = domain_name_cmd_idx.substring(sep_idx + 1);
    
            var codegen_file = 'https://robot-help.github.io/uncertainty/' + domain_name + '/' + cmd_idx_str + '.txt';
            $.get(codegen_file, function(data) {
                // var highlighted_code = hljs.highlight(data, {language: 'python'}).value;
                var highlighted_code = data;
                var html_code = codegen_html_template
                                    .replace('{code}', highlighted_code)
                                    // .replace('{link}', codegen_file)
                                    ;
                $(html_code).appendTo("#" + id);
             }, 'text');
        });
    
        var current_cmd_idxs = {
            "saycan": 1,
            "ur5": 1,
            "bimanual": 1,
        }
    
        var vid_start_times = {
            "saycan": {
                1: 0 * 60 + 0,
                2: 0 * 60 + 5,
                3: 0 * 60 + 20,
                4: 0 * 60 + 58,
                5: 1 * 60 + 37,
                6: 2 * 60 + 4,
                7: 2 * 60 + 44,
                8: 3 * 60 + 13,
                9: 3 * 60 + 33,
                10: 4 * 60 + 25,
                11: 5 * 60 + 20,
                12: 6 * 60 + 12,
                13: 7 * 60 + 2,
                14: 8 * 60 + 5,
                15: 9 * 60 + 3,
                16: 10 * 60 + 4,
            },
            "ur5": {
                1: 0 * 60 + 0,
                2: 0 * 60 + 23,
                3: 0 * 60 + 45,
                4: 1 * 60 + 6,
                5: 1 * 60 + 28,
                6: 1 * 60 + 50,
                7: 2 * 60 + 12,
                8: 2 * 60 + 34,
                9: 2 * 60 + 55,
                10: 3 * 60 + 15,
            },
            "bimanual": {
                1: 0 * 60 + 3,
                2: 0 * 60 + 24,
                3: 0 * 60 + 47,
                4: 1 * 60 + 15,
                5: 1 * 60 + 55,
                6: 2 * 60 + 20,
                7: 2 * 60 + 46,
                8: 3 * 60 + 13,
                9: 3 * 60 + 45,
                10: 4 * 60 + 26,
            }
        }
    
        var vid_end_times = {
            "saycan": {
                1: 0 * 60 + 5,
                2: 0 * 60 + 20,
                3: 0 * 60 + 58,
                4: 1 * 60 + 37,
                5: 2 * 60 + 4,
                6: 2 * 60 + 44,
                7: 3 * 60 + 13,
                8: 3 * 60 + 33,
                9: 4 * 60 + 25,
                10: 5 * 60 + 20,
                11: 6 * 60 + 12,
                12: 7 * 60 + 2,
                13: 8 * 60 + 5,
                14: 9 * 60 + 3,
                15: 10 * 60 + 4,
                16: 10 * 60 + 48,
            },
            "ur5": {
                1: 0 * 60 + 22,
                2: 0 * 60 + 44,
                3: 1 * 60 + 5,
                4: 1 * 60 + 27,
                5: 1 * 60 + 49,
                6: 2 * 60 + 11,
                7: 2 * 60 + 33,
                8: 2 * 60 + 54,
                9: 3 * 60 + 14,
                10: 3 * 60 + 36,
            },
            "bimanual": {
                1: 0 * 60 + 23,
                2: 0 * 60 + 46,
                3: 1 * 60 + 10,
                4: 1 * 60 + 49,
                5: 2 * 60 + 15,
                6: 2 * 60 + 42,
                7: 3 * 60 + 5,
                8: 3 * 60 + 34,
                9: 4 * 60 + 25,
                10: 4 * 60 + 55,
            }
        }
    
        function playSeg(vid, start_time, end_time, domain_name, desired_cmd_idx) {
            vid.play();
            vid.pause();
            vid.currentTime = start_time;
            vid.play();
    
            // console.log("start and end: " + start_time.toString() + ", " + end_time.toString());
    
            var pausing_function = function() {
                // console.log("checking pausing function cb for " + domain_name);
                // console.log("current and end time");
                // console.log(this.currentTime);
                // console.log(end_time)
                if (this.currentTime >= end_time) {
                    // console.log("reached end time");
                    this.pause();
                    this.removeEventListener("timeupdate", pausing_function);
                }
            };
    
            // console.log("adding timeupdate pausing_function for " + domain_name + "_" + desired_cmd_idx.toString());
            vid.addEventListener("timeupdate", pausing_function);
        }
    
        // demos
        $('select').on('change', function() {
            var sep_idx = this.value.indexOf('_');
            var domain_name = this.value.substring(0, sep_idx);
            var desired_cmd_idx = parseInt(this.value.substring(sep_idx + 1));
            var current_cmd_idx = current_cmd_idxs[domain_name];
            
            // hide current content
            var current_content = $('#content_' + domain_name + "_" + current_cmd_idx.toString());
            current_content.hide();
    
            // show desired content
            var desired_content = $('#content_' + domain_name + "_" + desired_cmd_idx.toString());
            desired_content.show();
    
            // switch videos
            // if (domain_name.startsWith("mobile")) {
            //     var current_vid = $('#vid_1_' + domain_name + "_" + current_cmd_idx.toString()).get(0);
            //     var desired_vid = $('#vid_1_' + domain_name + "_" + desired_cmd_idx.toString()).get(0);
            //     current_vid.pause();
            //     desired_vid.play();
            // } else {
            var vid = $("#vid_" + domain_name)[0];
            var start_time = vid_start_times[domain_name][desired_cmd_idx];
            var end_time = vid_end_times[domain_name][desired_cmd_idx];
            playSeg(vid, start_time, end_time, domain_name, desired_cmd_idx);
            // }
    
            // set current to desired
            current_cmd_idxs[domain_name] = desired_cmd_idx;
        });
    });
    