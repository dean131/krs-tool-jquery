
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
                                <td>${value[0]}</td>
                                <td>${value[4]}</td>
                                <td>${value[1]}</td>
                                <td>${value[2]}-${value[3]}</td>
                                <td>
                                    <a onclick="$.edit(${index})" href="#modalEdit" data-bs-toggle="modal" class="btn btn-outline-warning opacity-75">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                        </svg>
                                    </a>
                                    <a onclick="$.hapus(${index})" class="btn btn-outline-danger opacity-75">
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
        let nama_matkul = $('#nama_matkul').val();
        let hari = $('#hari').val();
        let jam_mulai = $('#jam_mulai').val();
        let jam_akhir = $('#jam_akhir').val();
        let jmlh_sks = $('#jmlh_sks').val();
        let data = [nama_matkul, hari, jam_mulai, jam_akhir, jmlh_sks];

        let tabrakan;
        $.each(data_base, function(index, value) {
            if (data[1] == value[1]) {
                if (data[2] >= value[2] && data[2] <= value[3]) {
                    tabrakan = index.toLocaleString();
                } else if (data[3] >= value[2] && data[3] <= value[3]) {
                    tabrakan = index.toLocaleString();
                } else if (value[2] >= data[2] && value[2] <= data[3]) {
                    tabrakan = index.toLocaleString();
                } else if (value[3] >= data[2] && value[3] <= data[3]) {
                    tabrakan = index.toLocaleString();
                }
            }
        });

        if (isNaN(jmlh_sks)) {
            let title = `Bor!`;
            let message = `Kalo SKS harus pake angka bor!`
            $.modalWarning(title, message);
            return;
        }

        if (tabrakan) {
            let title = `Jadwalnya tabrakan bor!`;
            let message = `Jadwalnya trabrakan sama ${data_base[tabrakan][0]} bor!`
            $.modalWarning(title, message);
        } else {
            data_base.push(data);
            $.tampil();
            $.resetForm();
        }
    });

    $.hapus = function(index) {
        data_base.splice(index, 1);
        $.tampil();
    }

    $.hitungan = function() {
        let total_matkul = data_base.length;
        let total_sks = 0;

        $.each(data_base, function(index, value) {
            total_sks += parseInt(value[4]);
        });

        let hitung =   `<ul class="list-group">
                            <li class="list-group-item">Jumlah Mata kuliah: <strong>${total_matkul}</strong></li>
                            <li class="list-group-item">Total SKS: <strong>${total_sks}</strong></li>
                        </ul>`;

        $('#hitungan').html(hitung);
    }

    $.edit = function(index) {
        $('#modal_nama_matkul').val(data_base[index][0]);
        $('#modal_hari').val(data_base[index][1]);
        $('#modal_jam_mulai').val(data_base[index][2]);
        $('#modal_jam_akhir').val(data_base[index][3]);
        $('#modal_jmlh_sks').val(data_base[index][4]);
        $('#modal_index').val(index);
    }

    $('#modal_btn_simpan').click(function() {
        let nama_matkul = $('#modal_nama_matkul').val();
        let hari = $('#modal_hari').val();
        let jam_mulai = $('#modal_jam_mulai').val();
        let jam_akhir = $('#modal_jam_akhir').val();
        let jmlh_sks = $('#modal_jmlh_sks').val();
        let data = [nama_matkul, hari, jam_mulai, jam_akhir, jmlh_sks];

        let modal_index = $('#modal_index').val();
        
        let tabrakan;
        $.each(data_base, function(index, value) {
            if (index.toLocaleString() == modal_index.toLocaleString()) {
                return;
            } else if (data[1] == value[1]) {
                if (data[2] >= value[2] && data[2] <= value[3]) {
                    tabrakan = index.toLocaleString();
                } else if (data[3] >= value[2] && data[3] <= value[3]) {
                    tabrakan = index.toLocaleString();
                } else if (value[2] >= data[2] && value[2] <= data[3]) {
                    tabrakan = index.toLocaleString();
                } else if (value[3] >= data[2] && value[3] <= data[3]) {
                    tabrakan = index.toLocaleString();
                }
            }
        });

        if (tabrakan) {
            let title = `Jadwalnya tabrakan bor!`;
            let message = `Jadwalnya trabrakan sama ${data_base[tabrakan][0]} bor!`
            $.modalWarning(title, message);
        } else {
            data_base[modal_index] = data;
            $.tampil();
        }
    });

    $.resetForm = function() {
        $('#nama_matkul').val('');
        $('#hari').prop('selectedIndex',0);
        $('#jam_mulai').val('');
        $('#jam_akhir').val('');
        $('#jmlh_sks').val('');
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
            if ( a[2] < b[2] ){
                return -1;
            }
            if ( a[2] > b[2] ){
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
            switch (i[1].toLowerCase()) {
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

        let card_senin, card_selasa, card_rabu, card_kamis, card_jumat, card_sabtu;
        
        if (list_senin) {
            card_senin = `  <div class="day-box">
                                <div class="day-box-header">
                                    <h2 class="day-box-title">Senin</h2>
                                </div>
                                <div class="day-box-body">
                                    <table class="day-box-table">
                                        <tbody>`
            for (const i of list_senin) {
                card_senin += ` <tr>
                                    <td>${i[0]}</td>
                                    <td>${i[4]}</td>
                                    <td>${i[2]}-${i[3]}</td>
                                </tr>`
            }
            card_senin +=               `   </tbody>
                                        </table>
                                    </div>
                                </div>`
        }
        
        if (list_selasa) {
            card_selasa = ` <div class="day-box">
                                <div class="day-box-header">
                                    <h2 class="day-box-title">Selasa</h2>
                                </div>
                                <div class="day-box-body">
                                    <table class="day-box-table">
                                        <tbody>`
            for (const i of list_selasa) {
                card_selasa += ` <tr>
                                    <td>${i[0]}</td>
                                    <td>${i[4]}</td>
                                    <td>${i[2]}-${i[3]}</td>
                                </tr>`
            }
            card_selasa +=               `   </tbody>
                                        </table>
                                    </div>
                                </div>`
        }
        
        if (list_rabu) {
            card_rabu = `   <div class="day-box">
                                <div class="day-box-header">
                                    <h2 class="day-box-title">Rabu</h2>
                                </div>
                                <div class="day-box-body">
                                    <table class="day-box-table">
                                        <tbody>`
            for (const i of list_rabu) {
                card_rabu += ` <tr>
                                    <td>${i[0]}</td>
                                    <td>${i[4]}</td>
                                    <td>${i[2]}-${i[3]}</td>
                                </tr>`
            }
            card_rabu +=               `   </tbody>
                                        </table>
                                    </div>
                                </div>`
        }
        
        if (list_kamis) {
            card_kamis = `  <div class="day-box">
                                <div class="day-box-header">
                                    <h2 class="day-box-title">Kamis</h2>
                                </div>
                                <div class="day-box-body">
                                    <table class="day-box-table">
                                        <tbody>`
            for (const i of list_kamis) {
                card_kamis += ` <tr>
                                    <td>${i[0]}</td>
                                    <td>${i[4]}</td>
                                    <td>${i[2]}-${i[3]}</td>
                                </tr>`
            }
            card_kamis +=               `   </tbody>
                                        </table>
                                    </div>
                                </div>`
        }
        
        if (list_jumat) {
            card_jumat = `  <div class="day-box">
                                <div class="day-box-header">
                                    <h2 class="day-box-title">Jum'at</h2>
                                </div>
                                <div class="day-box-body">
                                    <table class="day-box-table">
                                        <tbody>`
            for (const i of list_jumat) {
                card_jumat += ` <tr>
                                    <td>${i[0]}</td>
                                    <td>${i[4]}</td>
                                    <td>${i[2]}-${i[3]}</td>
                                </tr>`
            }
            card_jumat +=               `   </tbody>
                                        </table>
                                    </div>
                                </div>`
        }
        
        if (list_sabtu) {
            card_sabtu = `  <div class="day-box">
                                <div class="day-box-header">
                                    <h2 class="day-box-title">Sabtu</h2>
                                </div>
                                <div class="day-box-body">
                                    <table class="day-box-table">
                                        <tbody>`
            for (const i of list_sabtu) {
                card_sabtu += ` <tr>
                                    <td>${i[0]}</td>
                                    <td>${i[4]}</td>
                                    <td>${i[2]}-${i[3]}</td>
                                </tr>`
            }
            card_sabtu +=               `   </tbody>
                                        </table>
                                    </div>
                                </div>`
        }

        return card_senin + card_selasa + card_rabu + card_kamis + card_jumat + card_sabtu;
    }

    $.myPrint = function() {
        let card_all = $.sortingDataBase();
        let pagePrint = `   <div class="container" id="printBor">`
        pagePrint += card_all;
        pagePrint +=        `</div>`
                            
        $('#myPrint1').html(pagePrint);
        printJS({ 
            printable: 'printBor', 
            type: 'html', 
            targetStyles: ['*']
            // header: 'PrintJS - Form Element Selection' 
        });
    }

    $.tampil();

});