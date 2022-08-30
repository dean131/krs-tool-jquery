
$(document).ready(function() {

    let data_base = [];

    $.tampil = function() {
        let table = `<table class="table table-sm table-hover" id="myTable">
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
            $.each(data_base, function(index, value) {
                table +=    `<tr>
                                <td>${index+1}</td>
                                <td>${value.nama_matkul}</td>
                                <td>${value.jmlh_sks}</td>
                                <td>${value.hari}</td>
                                <td>${value.jam_mulai}-${value.jam_akhir}</td>
                                <td>
                                    <a onclick="$.edit(${value.id_matkul})" href="#modalEdit" data-bs-toggle="modal" class="btn btn-outline-warning opacity-75">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                        </svg>
                                    </a>
                                    <a onclick="$.hapus(${value.id_matkul})" class="btn btn-outline-danger opacity-75">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                        </svg>
                                    </a>
                                </td>
                            </tr>`;
            });
        }
        
        table += `</tbody></table>`;
        $('#table_matkul').html(table);

        $.hitungan();

        $('#myTable').DataTable({
            "paging": false,
            "searching": false,
            "info": false,
            "language": {
                "emptyTable": "Belom ada data yang di gaskeun bor!"
            }
        });
    }

    $('#btn_submit').click(function() {
        let data, data2;
        data = {
            'id_matkul' : 0,
            'nama_matkul' : $('#nama_matkul').val(), 
            'hari' : $('#hari').val(), 
            'jam_mulai' : $('#jam_mulai').val(), 
            'jam_akhir' : $('#jam_akhir').val(), 
            'jmlh_sks' : parseInt($('#jmlh_sks').val()),
            'sesi2' : false
        };
        
        if ($('#hari2').val()) {
            data2 = {
                'id_matkul' : 0,
                'nama_matkul' : data.nama_matkul + ' (sesi 2)', 
                'hari' : $('#hari2').val(), 
                'jam_mulai' : $('#jam_mulai2').val(), 
                'jam_akhir' : $('#jam_akhir2').val(), 
                'jmlh_sks' : data.jmlh_sks,
                'sesi2' : true
            };

            if ($.cekField(data) && $.cekField(data2) && $.cekTabrakan(data_base, data) && $.cekTabrakan(data_base, data2)) {
                if ($.cekTabrakan2sesi(data, data2)) {
                    data.jmlh_sks /= 2;
                    data2.jmlh_sks = data.jmlh_sks;
                    data.id_matkul = $.maxID();
                    data2.id_matkul = data.id_matkul;
                    $.tambahData(data);
                    $.tambahData(data2);
                }
            }
        } else {
            if ($.cekField(data) && $.cekTabrakan(data_base, data)) {
                data.id_matkul = $.maxID();
                $.tambahData(data);
            }
        }
    });

    $.maxID = function() {
        let idies = [0];
        if (data_base) {
            $.each(data_base,function(index, value) {
                idies.push(value.id_matkul);
            });
        }
        return Math.max(...idies) + 1;
    }

    $.cekField = function(data) {
        if (!data.nama_matkul) {
            $.modalWarning('Bor!', 'Isi field nama MATKUL nya bor!');
            return false;
        } else if (isNaN(data.jmlh_sks) || !data.jmlh_sks) {
            $.modalWarning('Bor!', 'Isi field SKS nya pake angka bor!');
            return false;
        } else if (!data.jam_mulai || !data.jam_akhir) {
            $.modalWarning('Bor!', 'Isi dulu jam nya bor!');
            return false;
        } else {
            return true;
        }
    }

    $.cekTabrakan = function(arr, data) {
        let tabrakan;
        $.each(arr, function(index, value) {
            if (data.hari == value.hari) {
                if (data.jam_mulai >= value.jam_mulai && data.jam_mulai <= value.jam_akhir) {
                    tabrakan = index.toString();
                } else if (data.jam_akhir >= value.jam_mulai && data.jam_akhir <= value.jam_akhir) {
                    tabrakan = index.toString();
                } else if (value.jam_mulai >= data.jam_mulai && value.jam_mulai <= data.jam_akhir) {
                    tabrakan = index.toString();
                } else if (value.jam_akhir >= data.jam_mulai && value.jam_akhir <= data.jam_akhir) {
                    tabrakan = index.toString();
                }
            }
        });
    
        if (tabrakan) {
            $.modalWarning('Bor!', `Jadwalnya tabrakan sama ${arr[tabrakan].nama_matkul} bor!`);
            return false;
        } else {
            return true;
        }
    }

    $.cekTabrakan2sesi = function(data, data2) {
        let tabrakan;
        if (data.hari == data2.hari) {
            if (data.jam_mulai >= data2.jam_mulai && data.jam_mulai <= data2.jam_akhir) {
                tabrakan = true;
            } else if (data.jam_akhir >= data2.jam_mulai && data.jam_akhir <= data2.jam_akhir) {
                tabrakan = true;
            } else if (data2.jam_mulai >= data.jam_mulai && data2.jam_mulai <= data.jam_akhir) {
                tabrakan = true;
            } else if (data2.jam_akhir >= data.jam_mulai && data2.jam_akhir <= data.jam_akhir) {
                tabrakan = true;
            }
        }
    
        if (tabrakan) {
            $.modalWarning('Bor!', 'Sesi 1 sama sesi 2 tabrakan bor!');
            return false;
        } else {
            return true;
        }
    }

    $.tambahData = function(data) {
        data_base.push(data);
        $.tampil();
        $.resetForm();
    }

    $.hapus = function(aydi) {
        data_base = data_base.filter(object => {return object.id_matkul != aydi});
        $.tampil();
    }

    $.hitungan = function() {
        let total_matkul = data_base.length;
        let total_sks = 0;

        $.each(data_base, function(index, value) {
            total_sks += value.jmlh_sks;
        });

        $('#hitungan').html(
            /*html*/`   <ul class="rounded-3 list-group list-group-flush">
                            <li class="list-group-item">Jumlah Mata kuliah: <strong>${total_matkul}</strong></li>
                            <li class="list-group-item">Total SKS: <strong>${total_sks}</strong></li>
                        </ul>`
        );
    }
    
    $.editByAttr = function(arr, value, data,  data2){
        if (data2) {
            let i = arr.length;
            while(i--){
                if( arr[i] && arr[i].hasOwnProperty('id_matkul') && (arguments.length > 2 && arr[i]['id_matkul'] == value ) ){ 
                    if (arr[i].sesi2 == true) {
                        arr[i] = data2;
                    } else {
                        arr[i] = data;
                    }
                }
            }
            return arr;
        } else {
            let i = arr.length;
            while(i--){
                if( arr[i] && arr[i].hasOwnProperty('id_matkul') && (arguments.length > 2 && arr[i]['id_matkul'] == value ) ){ 
                    arr[i] = data;
                }
            }
            return arr;

        }
    }

    $.edit = function(aydi) {
        let arr_edit = data_base.filter(object => {return object.id_matkul == aydi});
        $('#edit_nama_matkul').val(arr_edit[0].nama_matkul);
        $('#edit_jmlh_sks').val(arr_edit[0].jmlh_sks);
        $('#edit_hari').val(arr_edit[0].hari);
        $('#edit_jam_mulai').val(arr_edit[0].jam_mulai);
        $('#edit_jam_akhir').val(arr_edit[0].jam_akhir);

        $('#edit_aydi').val(aydi);
        
        if (arr_edit.length == 2) {
            $.editFormWaktu(2);
            $('#edit_jmlh_sks').val(arr_edit[0].jmlh_sks + arr_edit[1].jmlh_sks);
            $('#edit_hari2').val(arr_edit[1].hari);
            $('#edit_jam_mulai2').val(arr_edit[1].jam_mulai);
            $('#edit_jam_akhir2').val(arr_edit[1].jam_akhir);
        } else {
            $.editFormWaktu(1);
        }
    }

    $('#edit_btn_simpan').click(function() {
        let data, data2;
        let edit_aydi = parseInt($('#edit_aydi').val());
        let db_cek = data_base.filter(object => {return object.id_matkul != edit_aydi});
        data = {
            'id_matkul' : edit_aydi,
            'nama_matkul' : $('#edit_nama_matkul').val(), 
            'hari' : $('#edit_hari').val(), 
            'jam_mulai' : $('#edit_jam_mulai').val(), 
            'jam_akhir' : $('#edit_jam_akhir').val(), 
            'jmlh_sks' : parseInt($('#edit_jmlh_sks').val()),
            'sesi2' : false
        };

        if ($('#edit_hari2').val()) {
            data2 = {
                'id_matkul' : edit_aydi,
                'nama_matkul' : data.nama_matkul + ' (sesi 2)', 
                'hari' : $('#edit_hari2').val(), 
                'jam_mulai' : $('#edit_jam_mulai2').val(), 
                'jam_akhir' : $('#edit_jam_akhir2').val(), 
                'jmlh_sks' : data.jmlh_sks,
                'sesi2' : true
            };
            data.jmlh_sks /= 2;
            data2.jmlh_sks = data.jmlh_sks;
            if ($.cekTabrakan(db_cek, data) && $.cekTabrakan(db_cek, data2) && $.cekField(data) && $.cekField(data2)) {
                $.editByAttr(data_base, edit_aydi, data, data2);
            }
        } else {
            if ($.cekTabrakan(db_cek, data) && $.cekField(data)) {
                $.editByAttr(data_base, edit_aydi, data, data2);
            }
        }
        $.tampil();
    });

    $.resetForm = function() {
        $('#nama_matkul').val('');
        $('#hari').prop('selectedIndex',0);
        $('#sesi').prop('selectedIndex',0);
        $('#jam_mulai').val('');
        $('#jam_akhir').val('');
        $('#jmlh_sks').val('');
        $.formWaktu();
    }

    $.modalWarning = function(title, message) {
        $('#modal-warning-title').html(`<h5>${title}</h5>`);
        $('#modal-warning-message').html(`<p>${message}</p>`);
        $('#modal-warning').modal('show');
    }

    $.sortingDataBase = function() {
        function compare( a, b ) {
            if ( a.jam_akhir < b.jam_akhir ){
                return -1;
            }
            if ( a.jam_akhir > b.jam_akhir ){
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
            switch (i.hari.toLowerCase()) {
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

        const template_card_head = function(hari) {
            return  /*html*/`   <div class="day-box">
                                    <div class="day-box-header">
                                        ${hari}
                                    </div>
                                    <div class="day-box-body">
                                        <table class="day-box-table">
                                            <tbody>`
        }

        const template_card_body = function(i) {
            return  /*html*/` <tr>
                                <td class="nama-matkul">${i.nama_matkul}</td>
                                <td class="sks">${i.jmlh_sks}</td>
                                <td>${i.jam_mulai}-${i.jam_akhir}</td>
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

    $.formWaktu = function(sesi) {
        if (sesi == '2') {
            $('#waktu').html(
                /*html*/`   <label class="form-label border-bottom mt-1" for="section_sesi2">Sesi 2</label>
                            <div class="mb-3 col-lg-4" id="section_sesi2">
                            <label class="form-label" for="hari2">Hari</label>
                            <select class="form-select" id="hari2" aria-label="Default select example">
                                <option value="Senin">Senin</option>
                                <option value="Selasa">Selasa</option>
                                <option value="Rabu">Rabu</option>
                                <option value="Kamis">Kamis</option>
                                <option value="Jum'at">Jum'at</option>
                                <option value="Sabtu">Sabtu</option>
                            </select>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <label class="form-label" for="jam_mulai2">Jam Mulai</label>
                            <input type="time" id="jam_mulai2" class="form-control">
                        </div>
                        <div class="col-lg-4 mb-3">
                            <label class="form-label" for="jam_akhir2">Jam Akhir</label>
                            <input type="time" id="jam_akhir2" class="form-control">
                        </div>`
            );
        } else {
            $('#waktu').html('');
        }
    }

    $.editFormWaktu = function(sesi) {
        if (sesi == '2') {
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

    $.tampil();

});