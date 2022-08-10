
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

            if ($.cekField(data) && $.cekTabrakan(data_base, data)) {
                if ($.cekField(data2) && $.cekTabrakan(data_base, data2)) {
                    if ($.cekTabrakan2sesi(data, data2)) {
                        data.jmlh_sks /= 2;
                        data2.jmlh_sks = data.jmlh_sks;
                        data.id_matkul = $.maxID();
                        data2.id_matkul = data.id_matkul;
                        $.tambahData(data);
                        $.tambahData(data2);
                    }
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
            let title = `Bor!`;
            let message = `Isi dulu field nama MATKUL nya bor!`
            $.modalWarning(title, message);
            return false;
        } else if (!data.jam_mulai || !data.jam_akhir) {
            let title = `Bor!`;
            let message = `Isi dulu jam nya bor!`
            $.modalWarning(title, message);
            return false;
        } else if (!data.jmlh_sks) {
            let title = `Bor!`;
            let message = `Isi dulu field SKS nya bor!`
            $.modalWarning(title, message);
            return false;
        } else if (isNaN(data.jmlh_sks)) {
            let title = `Bor!`;
            let message = `Kalo SKS harus pake angka bor!`
            $.modalWarning(title, message);
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
            let title = `Bor!`;
            let message = `Jadwalnya tabrakan sama ${arr[tabrakan].nama_matkul} bor!`
            $.modalWarning(title, message);
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
            let title = `Bor!`;
            let message = `Sesi 1 sama sesi 2 tabrakan bor!`
            $.modalWarning(title, message);
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
    
    // $.removeByAttr = function(arr, attr, value){
    //     let i = arr.length;
    //     while(i--){
    //         if( arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value ) ){ 
    //             arr.splice(i,1);
    //         }
    //     }
    //     return arr;
    // }

    $.hapus = function(aydi) {
        // $.removeByAttr(data_base, 'id_matkul', aydi);
        data_base = data_base.filter(object => {return object.id_matkul != aydi});
        $.tampil();
    }

    $.hitungan = function() {
        let total_matkul = data_base.length;
        let total_sks = 0;

        $.each(data_base, function(index, value) {
            total_sks += value.jmlh_sks;
        });

        let hitung =   `<ul class="rounded-3 list-group list-group-flush">
                            <li class="list-group-item">Jumlah Mata kuliah: <strong>${total_matkul}</strong></li>
                            <li class="list-group-item">Total SKS: <strong>${total_sks}</strong></li>
                        </ul>`;

        $('#hitungan').html(hitung);
    }

    // $.findEditByAttr = function(arr, attr, aydi){
    //     let arr_edit = [];
    //     let i = arr.length;
    //     while(i--){
    //         if( arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === aydi ) ){ 
    //             arr_edit.push(data_base[i]);
    //         }
    //     }
    //     return arr_edit;
    // }
    
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
        // let arr_edit = $.findEditByAttr(data_base, 'id_matkul', aydi);
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
            if (
                $.cekTabrakan(data_base.filter(object => {return object.id_matkul != edit_aydi}), data)
                && $.cekTabrakan(data_base.filter(object => {return object.id_matkul != edit_aydi}), data2)
                ) {
                $.editByAttr(data_base, edit_aydi, data, data2);
            }
        } else {
            if (
                $.cekTabrakan(data_base.filter(object => {return object.id_matkul != edit_aydi}), data)
                ) {
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
        let this_title = `<h5>${title}</h5>`;
        let this_message = `<p>${message}</p>`;
        $('#modal-warning-title').html(this_title);
        $('#modal-warning-message').html(this_message);
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
        
        let list_senin = []
        let list_selasa = []
        let list_rabu = []
        let list_kamis = []
        let list_jumat = []
        let list_sabtu = []
        
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
        
        let card_senin = `  <div class="day-box">
                                <div class="day-box-header">
                                    Senin
                                </div>
                                <div class="day-box-body">
                                    <table class="day-box-table">
                                        <tbody>`
        for (const i of list_senin) {
            card_senin += ` <tr>
                                <td class="nama-matkul">${i.nama_matkul}</td>
                                <td class="sks">${i.jmlh_sks}</td>
                                <td>${i.jam_mulai}-${i.jam_akhir}</td>
                            </tr>`
            } 

        if (list_senin.length == 0) {
            card_senin += ` <tr>
                                <td>Tidak ada jadwal</td>
                            </tr>`
        }

        card_senin +=`          </tbody>
                            </table>
                        </div>
                    </div>`
        
        let card_selasa = `  <div class="day-box">
                                <div class="day-box-header">
                                    Selasa
                                </div>
                                <div class="day-box-body">
                                    <table class="day-box-table">
                                        <tbody>`
        for (const i of list_selasa) {
            card_selasa += ` <tr>
                                <td class="nama-matkul">${i.nama_matkul}</td>
                                <td class="sks">${i.jmlh_sks}</td>
                                <td>${i.jam_mulai}-${i.jam_akhir}</td>
                            </tr>`
            } 

        if (list_selasa.length == 0) {
            card_selasa += ` <tr>
                                <td>Tidak ada jadwal</td>
                            </tr>`
        }

        card_selasa +=`         </tbody>
                            </table>
                        </div>
                    </div>`
        
        let card_rabu = `  <div class="day-box">
                                <div class="day-box-header">
                                    Rabu
                                </div>
                                <div class="day-box-body">
                                    <table class="day-box-table">
                                        <tbody>`
        for (const i of list_rabu) {
            card_rabu += ` <tr>
                                <td class="nama-matkul">${i.nama_matkul}</td>
                                <td class="sks">${i.jmlh_sks}</td>
                                <td>${i.jam_mulai}-${i.jam_akhir}</td>
                            </tr>`
            } 

        if (list_rabu.length == 0) {
            card_rabu += ` <tr>
                                <td>Tidak ada jadwal</td>
                            </tr>`
        }

        card_rabu +=`           </tbody>
                            </table>
                        </div>
                    </div>`
        
        let card_kamis = `  <div class="day-box">
                                <div class="day-box-header">
                                    Kamis
                                </div>
                                <div class="day-box-body">
                                    <table class="day-box-table">
                                        <tbody>`
        for (const i of list_kamis) {
            card_kamis += ` <tr>
                                <td class="nama-matkul">${i.nama_matkul}</td>
                                <td class="sks">${i.jmlh_sks}</td>
                                <td>${i.jam_mulai}-${i.jam_akhir}</td>
                            </tr>`
            } 

        if (list_kamis.length == 0) {
            card_kamis += ` <tr>
                                <td>Tidak ada jadwal</td>
                            </tr>`
        }

        card_kamis +=`          </tbody>
                            </table>
                        </div>
                    </div>`
        
        let card_jumat = `  <div class="day-box">
                                <div class="day-box-header">
                                    Jum'at
                                </div>
                                <div class="day-box-body">
                                    <table class="day-box-table">
                                        <tbody>`
        for (const i of list_jumat) {
            card_jumat += ` <tr>
                                <td class="nama-matkul">${i.nama_matkul}</td>
                                <td class="sks">${i.jmlh_sks}</td>
                                <td>${i.jam_mulai}-${i.jam_akhir}</td>
                            </tr>`
            } 

        if (list_jumat.length == 0) {
            card_jumat += ` <tr>
                                <td>Tidak ada jadwal</td>
                            </tr>`
        }

        card_jumat +=`          </tbody>
                            </table>
                        </div>
                    </div>`
        
        let card_sabtu = `  <div class="day-box">
                                <div class="day-box-header">
                                    Sabtu
                                </div>
                                <div class="day-box-body">
                                    <table class="day-box-table">
                                        <tbody>`
        for (const i of list_sabtu) {
            card_sabtu += ` <tr>
                                <td class="nama-matkul">${i.nama_matkul}</td>
                                <td class="sks">${i.jmlh_sks}</td>
                                <td>${i.jam_mulai}-${i.jam_akhir}</td>
                            </tr>`
            } 

        if (list_sabtu.length == 0) {
            card_sabtu += ` <tr>
                                <td>Tidak ada jadwal</td>
                            </tr>`
        }

        card_sabtu +=`          </tbody>
                            </table>
                        </div>
                    </div>`

        return card_senin + card_selasa + card_rabu + card_kamis + card_jumat + card_sabtu;
    }

    $.myPrint = function() {
        let card_all = $.sortingDataBase();
        let pagePrint = `   <div class="container" id="pagePrint">`
        pagePrint += card_all;
        pagePrint +=    `   </div>`
                            
        $('#divPrint').html(pagePrint);
        printJS({ 
            printable: 'pagePrint', 
            type: 'html', 
            targetStyles: ['*']
            // header: 'PrintJS - Form Element Selection' 
        });
    }

    $.formWaktu = function(sesi) {
        if (sesi == '2') {
            let waktuForm = `   <label class="form-label border-bottom mt-1" for="section_sesi2">Sesi 2</label>
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
                                </div>`;
            $('#waktu').html(waktuForm);
        } else {
            $('#waktu').html('');
        }
    }

    $.editFormWaktu = function(sesi) {
        if (sesi == '2') {
            // $('#edit_sesi').val('2'); // fitur nonaktif
            let waktuForm = `   <label class="form-label border-bottom mt-1" for="section_edit_sesi2">Sesi 2</label>
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
                                </div>`;
            $('#modal_edit_jam').html(waktuForm);
        } else {
            $('#modal_edit_jam').html('');
        }
    }

    $.tampil();

});