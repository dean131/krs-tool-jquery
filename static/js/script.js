
$(document).ready(function() {

    let data_base = [];
    let numberOfLesson = 0;

    $.showTable = function() {
        $.createTable();
        $.tableFormat();
        $.countBox();
    }

    $.createTable = function() {
        let htmlTable = /*html*/`   <table class="table table-sm table-hover" id="myTable">
                                        <thead class="sticky-top text-light bg-success bg-opacity-50">
                                            <tr>
                                                <th>No</th>
                                                <th>Nama Matkul</th>
                                                <th>SKS</th>
                                                <th>Hari</th>
                                                <th>Jam</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;

        if (data_base) {
            $.each(data_base, function(index, lesson) {
                htmlTable += /*html*/`  <tr>
                                            <td>${index+1}</td>
                                            <td>${lesson.name}</td>
                                            <td>${lesson.credits}</td>
                                            <td>${lesson.day}</td>
                                            <td>${lesson.startTime}-${lesson.finishTime}</td>
                                            <td>
                                                <a onclick="$.edit(${lesson.id})" href="#modalEdit" data-bs-toggle="modal" class="btn btn-outline-warning opacity-75">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                                    </svg>
                                                </a>
                                                <a onclick="$.hapus(${lesson.id})" class="btn btn-outline-danger opacity-75">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                                    </svg>
                                                </a>
                                            </td>
                                        </tr>`;
            });
        }

        htmlTable += /*html*/`</tbody></table>`;
        $('#table_matkul').html(htmlTable);
    }

    $.tableFormat = function() {
        $('#myTable').DataTable({
            "paging": false,
            "searching": false,
            "info": false,
            "language": {
                "emptyTable": "Belom ada data yang digaskeun bor!"
            }
        });
    }

    $('#addLessonButton').click(function() {
        let lesson, lesson2;
        lesson = {
            'id' : 0,
            'name' : $('#lessonName').val(), 
            'day' : $('#lessonDay').val(), 
            'startTime' : $('#startTime').val(), 
            'finishTime' : $('#finishTime').val(), 
            'credits' : parseInt($('#lessonCredits').val()),
            'hasSessionTwo' : false
        };

        if ($('#lessonDay2').val()) {
            lesson2 = {
                'id' : 0,
                'name' : lesson.name + ' (sesi 2)', 
                'day' : $('#lessonDay2').val(), 
                'startTime' : $('#startTime2').val(), 
                'finishTime' : $('#finishTime2').val(), 
                'credits' : lesson.credits,
                'hasSessionTwo' : true
            };

            const isFilled = $.fieldCheck(lesson) && $.fieldCheck(lesson2);
            const isClash = $.clashCheck(data_base, lesson) && $.clashCheck(data_base, lesson2);
            if (isFilled && isClash) {
                if ($.clashCheckTwoSession(lesson, lesson2)) {
                    numberOfLesson += 1;
                    lesson.credits /= 2;
                    lesson2.credits = lesson.credits;
                    lesson.id = $.giveId();
                    lesson2.id = lesson.id;
                    $.addLesson(lesson2);
                    $.addLesson(lesson);
                }
            }

        } else {
            const isFilled = $.fieldCheck(lesson);
            const isClash = $.clashCheck(data_base, lesson);
            if (isFilled && isClash) {
                numberOfLesson += 1;
                lesson.id = $.giveId();
                $.addLesson(lesson);
            }
        }
    });

    $.giveId = function() {
        let idies = [0];
        if (data_base) {
            for (lesson of data_base) {
                idies.push(lesson.id);
            }
        }
        return Math.max(...idies) + 1;
    }

    $.fieldCheck = function(lesson) {
        if (!lesson.name) {
            $.modalWarning('Bor!', 'Isi field nama MATKUL nya bor!');
            return false;
        } else if (isNaN(lesson.credits) || !lesson.credits) {
            $.modalWarning('Bor!', 'Isi field SKS nya pake angka bor!');
            return false;
        } else if (!lesson.startTime || !lesson.finishTime) {
            $.modalWarning('Bor!', 'Isi dulu jam nya bor!');
            return false;
        } else {
            return true;
        }
    }

    $.clashCheck = function(arr, lesson) {
        let clashIndex;
        $.each(arr, function(index, ittrLesson) {
            if (lesson.day == ittrLesson.day) {
                if (lesson.startTime >= ittrLesson.startTime && lesson.startTime <= ittrLesson.finishTime) {
                    clashIndex = index.toString();
                } else if (lesson.finishTime >= ittrLesson.startTime && lesson.finishTime <= ittrLesson.finishTime) {
                    clashIndex = index.toString();
                } else if (ittrLesson.startTime >= lesson.startTime && ittrLesson.startTime <= lesson.finishTime) {
                    clashIndex = index.toString();
                } else if (ittrLesson.finishTime >= lesson.startTime && ittrLesson.finishTime <= lesson.finishTime) {
                    clashIndex = index.toString();
                }
            }
        });
    
        if (clashIndex) {
            $.modalWarning('Bor!', `Jadwalnya bentrok sama ${arr[clashIndex].name} bor!`);
            return false;
        } else {
            return true;
        }
    }

    $.clashCheckTwoSession = function(lesson, lesson2) {
        let clash;
        if (lesson.day == lesson2.day) {
            if (lesson.startTime >= lesson2.startTime && lesson.startTime <= lesson2.finishTime) {
                clash = true;
            } else if (lesson.finishTime >= lesson2.startTime && lesson.finishTime <= lesson2.finishTime) {
                clash = true;
            } else if (lesson2.startTime >= lesson.startTime && lesson2.startTime <= lesson.finishTime) {
                clash = true;
            } else if (lesson2.finishTime >= lesson.startTime && lesson2.finishTime <= lesson.finishTime) {
                clash = true;
            }
        }
    
        if (clash) {
            $.modalWarning('Bor!', 'Sesi 1 sama sesi 2 bentrok bor!');
            return false;
        } else {
            return true;
        }
    }

    $.addLesson = function(lesson) {
        data_base.unshift(lesson);
        $.showTable();
        $.resetForm();
    }

    $.hapus = function(id) {
        data_base = data_base.filter(lesson => {return lesson.id != id});
        numberOfLesson -= 1;
        $.showTable();
    }

    $.countBox = function() {
        let totalCredits = 0;

        for (lesson of data_base) {
            totalCredits += lesson.credits;
        }

        $('#countBox').html(
            /*html*/`   <ul class="rounded-3 list-group list-group-flush">
                            <li class="list-group-item">Jumlah Mata kuliah: <strong>${numberOfLesson}</strong></li>
                            <li class="list-group-item">Total SKS: <strong>${totalCredits}</strong></li>
                        </ul>`
        );
    }
    
    $.editLessonByAttr = function(arr, value, lesson,  lesson2){
        if (lesson2) {
            let i = arr.length;
            while(i--){
                if( arr[i] && arr[i].hasOwnProperty('id') && (arguments.length > 2 && arr[i]['id'] == value ) ){ 
                    if (arr[i].hasSessionTwo == true) {
                        arr[i] = lesson2;
                    } else {
                        arr[i] = lesson;
                    }
                }
            }
            return arr;
        } else {
            let i = arr.length;
            while(i--){
                if( arr[i] && arr[i].hasOwnProperty('id') && (arguments.length > 2 && arr[i]['id'] == value ) ){ 
                    arr[i] = lesson;
                }
            }
            return arr;
        }
    }

    $.edit = function(id) {
        let arr_edit = data_base.filter(lesson => {return lesson.id == id});
        $('#edit_nama_matkul').val(arr_edit[0].name);
        $('#edit_jmlh_sks').val(arr_edit[0].credits);
        $('#edit_hari').val(arr_edit[0].day);
        $('#edit_jam_mulai').val(arr_edit[0].startTime);
        $('#edit_jam_akhir').val(arr_edit[0].finishTime);

        $('#edit_aydi').val(id);
        
        if (arr_edit.length == 2) {
            $.editFormWaktu(2);
            $('#edit_jmlh_sks').val(arr_edit[0].credits + arr_edit[1].credits);
            $('#edit_hari2').val(arr_edit[1].day);
            $('#edit_jam_mulai2').val(arr_edit[1].startTime);
            $('#edit_jam_akhir2').val(arr_edit[1].finishTime);
        } else {
            $.editFormWaktu(1);
        }
    }

    $('#edit_btn_simpan').click(function() {
        let lessson, lessson2;
        let edit_aydi = parseInt($('#edit_aydi').val());
        let db_cek = data_base.filter(lesson => {return lesson.id != edit_aydi});
        lessson = {
            'id' : edit_aydi,
            'name' : $('#edit_nama_matkul').val(), 
            'day' : $('#edit_hari').val(), 
            'startTime' : $('#edit_jam_mulai').val(), 
            'finishTime' : $('#edit_jam_akhir').val(), 
            'credits' : parseInt($('#edit_jmlh_sks').val()),
            'hasSessionTwo' : false
        };

        if ($('#edit_hari2').val()) {
            lessson2 = {
                'id' : edit_aydi,
                'name' : lessson.name + ' (sesi 2)', 
                'day' : $('#edit_hari2').val(), 
                'startTime' : $('#edit_jam_mulai2').val(), 
                'finishTime' : $('#edit_jam_akhir2').val(), 
                'credits' : lessson.credits,
                'hasSessionTwo' : true
            };
            lessson.credits /= 2;
            lessson2.credits = lessson.credits;
            if ($.clashCheck(db_cek, lessson) && $.clashCheck(db_cek, lessson2) && $.fieldCheck(lessson) && $.fieldCheck(lessson2)) {
                $.editLessonByAttr(data_base, edit_aydi, lessson, lessson2);
            }
        } else {
            if ($.clashCheck(db_cek, lessson) && $.fieldCheck(lessson)) {
                $.editLessonByAttr(data_base, edit_aydi, lessson, lessson2);
            }
        }
        $.showTable();
    });

    $.resetForm = function() {
        $('#lessonName').val('');
        $('#lessonDay').prop('selectedIndex',0);
        $('#lessonSession').prop('selectedIndex',0);
        $('#startTime').val('');
        $('#finishTime').val('');
        $('#lessonCredits').val('');
        $.sessionTwoForm('1');
    }

    $.modalWarning = function(title, message) {
        $('#modal-warning-title').html(`<h5>${title}</h5>`);
        $('#modal-warning-message').html(`<p>${message}</p>`);
        $('#modal-warning').modal('show');
    }

    $.sortingDataBase = function() {
        function compare( a, b ) {
            if ( a.finishTime < b.finishTime ){
                return -1;
            }
            if ( a.finishTime > b.finishTime ){
                return 1;
            }
            return 0;
        }
        
        let list_senin = [];
        let list_selasa = [];
        let list_rabu = [];
        let list_kamis = [];
        let list_jumat = [];
        let list_sabtu = [];
        
        for (const i of data_base) {
            switch (i.day.toLowerCase()) {
                case 'senin':
                    list_senin.push(i);
                    if (list_senin) {
                        list_senin.sort(compare);
                    }
                    continue;
                case 'selasa':
                    list_selasa.push(i);
                    if (list_selasa) {
                        list_selasa.sort(compare);
                    }
                    continue;
                case 'rabu':
                    list_rabu.push(i);
                    if (list_rabu) {
                        list_rabu.sort(compare);
                    }
                    continue;
                case 'kamis':
                    list_kamis.push(i);
                    if (list_kamis) {
                        list_kamis.sort(compare);
                    }
                    continue;
                case 'jum\'at':
                    list_jumat.push(i);
                    if (list_jumat) {
                        list_jumat.sort(compare);
                    }
                    continue;
                case 'sabtu':
                    list_sabtu.push(i);
                    if (list_sabtu) {
                        list_sabtu.sort(compare);
                    }
                    continue;
            }
        }

        const template_card_head = function(day) {
            return  /*html*/`   <div class="day-box">
                                    <div class="day-box-header">
                                        ${day}
                                    </div>
                                    <div class="day-box-body">
                                        <table class="day-box-table">
                                            <tbody>`
        }

        const template_card_body = function(i) {
            return  /*html*/` <tr>
                                <td class="nama-matkul">${i.name}</td>
                                <td class="sks">${i.credits}</td>
                                <td>${i.startTime}-${i.finishTime}</td>
                            </tr>`
        }

        const template_card_foot = /*html*/`</tbody></table></div></div>`
        
        const card_kosong = /*html*/`<tr><td>-</td></tr>`
        
        let card_senin = template_card_head('Senin');
        for (const i of list_senin) {
            card_senin += template_card_body(i);
            } 

        if (list_senin.length == 0) {
            card_senin += card_kosong;
        }

        card_senin += template_card_foot;
        
        let card_selasa = template_card_head('Selasa');
        for (const i of list_selasa) {
            card_selasa += template_card_body(i);
            } 

        if (list_selasa.length == 0) {
            card_selasa += card_kosong;
        }

        card_selasa += template_card_foot;
        
        let card_rabu = template_card_head('Rabu');
        for (const i of list_rabu) {
            card_rabu += template_card_body(i);
            } 

        if (list_rabu.length == 0) {
            card_rabu += card_kosong;
        }

        card_rabu += template_card_foot;
        
        let card_kamis = template_card_head('Kamis');
        for (const i of list_kamis) {
            card_kamis += template_card_body(i);
            } 

        if (list_kamis.length == 0) {
            card_kamis += card_kosong;
        }

        card_kamis += template_card_foot;
        
        let card_jumat = template_card_head('Jum\'at');
        for (const i of list_jumat) {
            card_jumat += template_card_body(i);
            } 

        if (list_jumat.length == 0) {
            card_jumat += card_kosong;
        }

        card_jumat += template_card_foot;
        
        let card_sabtu = template_card_head('Sabtu');
        for (const i of list_sabtu) {
            card_sabtu += template_card_body(i);
            } 

        if (list_sabtu.length == 0) {
            card_sabtu += card_kosong;
        }

        card_sabtu += template_card_foot;

        return card_senin + card_selasa + card_rabu + card_kamis + card_jumat + card_sabtu;
    }

    $('#btnPrint').click(function() {
        let card_all = $.sortingDataBase();
        let pagePrint = /*html*/`<div class="container" id="pagePrint">`
        pagePrint += card_all;
        pagePrint += /*html*/`</div>`
                            
        $('#divPrint').html(pagePrint);
        printJS({ 
            printable: 'pagePrint', 
            type: 'html', 
            targetStyles: ['*']
            // header: 'PrintJS - Form Element Selection' 
        });
    });

    $.sessionTwoForm = function(session) {
        if (session == '2') {
            $('#sessionTwoForm').html(
                /*html*/`   <label class="form-label border-bottom mt-1" for="section_sesi2">Sesi 2</label>
                            <div class="mb-3 col-lg-4" id="section_sesi2">
                            <label class="form-label" for="lessonDay2">Hari</label>
                            <select class="form-select" id="lessonDay2">
                                <option value="Senin">Senin</option>
                                <option value="Selasa">Selasa</option>
                                <option value="Rabu">Rabu</option>
                                <option value="Kamis">Kamis</option>
                                <option value="Jum'at">Jum'at</option>
                                <option value="Sabtu">Sabtu</option>
                            </select>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <label class="form-label" for="startTime2">Jam Mulai</label>
                            <input type="time" id="startTime2" class="form-control">
                        </div>
                        <div class="col-lg-4 mb-3">
                            <label class="form-label" for="finishTime2">Jam Akhir</label>
                            <input type="time" id="finishTime2" class="form-control">
                        </div>`
            );
        } else {
            $('#sessionTwoForm').html('');
        }
    }

    $('#lessonSession').change(function () { 
        const session = $(this).val();
        $.sessionTwoForm(session);
    });

    $.editFormWaktu = function(session) {
        if (session == '2') {
            // $('#edit_sesi').val('2'); // fitur nonaktif
            $('#modal_edit_jam').html(
                /*html*/`   <label class="form-label border-bottom mt-1" for="section_edit_sesi2">Sesi 2</label>
                            <div class="mb-3 col-lg-4" id="section_edit_sesi2">
                            <label class="form-label" for="edit_hari2">Hari</label>
                            <select class="form-select" id="edit_hari2" aria-label="Default select example">
                                <option value="Senin">Senin</option>
                                <option value="Selasa">Selasa</option>
                                <option value="Rabu">Rabu</option>
                                <option value="Kamis">Kamis</option>
                                <option value="Jum'at">Jum'at</option>
                                <option value="Sabtu">Sabtu</option>
                            </select>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <label class="form-label" for="edit_jam_mulai2">Jam Mulai</label>
                            <input type="time" id="edit_jam_mulai2" class="form-control">
                        </div>
                        <div class="col-lg-4 mb-3">
                            <label class="form-label" for="edit_jam_akhir2">Jam Akhir</label>
                            <input type="time" id="edit_jam_akhir2" class="form-control">
                        </div>`
            );
        } else {
            $('#modal_edit_jam').html('');
        }
    }

    $.showTable();

});