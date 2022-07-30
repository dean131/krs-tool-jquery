
$(document).ready(function() {

    let data_base = [];

    $.tampil = function() {
        let table = `<table class="table table-hover" id="myTable">
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
                                    <a onclick="$.edit(${index})" href="#modalEdit" data-bs-toggle="modal" class="btn btn-warning">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                        </svg>
                                    </a>
                                    <a onclick="$.hapus(${index})" class="btn btn-danger">
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
    }

    $('#form_matkul').submit(function(event) {
        event.preventDefault();
        let nama_matkul = $(this).find('#nama_matkul').val();
        let hari = $(this).find('#hari').val();
        let jam_mulai = $(this).find('#jam_mulai').val();
        let jam_akhir = $(this).find('#jam_akhir').val();
        let jmlh_sks = $(this).find('#jmlh_sks').val();
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
            alert('pake angka gan!');
            return;
        }

        if (tabrakan) {
            let tilte = `<h5>Tabrakan gan!</h5>`
            let message = `<p>Jadwalnya trabrakan sama ${data_base[tabrakan][0]} bor!</p>`;
            $('#modal-warning-title').html(tilte);
            $('#modal-warning-message').html(message);
            $('#modal-warning').modal('show');
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
            let tilte = `<h5>Tabrakan gan!</h5>`
            let message = `<p>Jadwalnya trabrakan sama ${data_base[tabrakan][0]} bor!</p>`;
            $('#modal-warning-title').html(tilte);
            $('#modal-warning-message').html(message);
            $('#modal-warning').modal('show');
        } else {
            data_base[modal_index] = data;
            $.tampil();
        }
    });

    $.resetForm = function() {
        $('#nama_matkul').val('');
        $('#hari').val(1);
        $('#jam_mulai').val('');
        $('#jam_akhir').val('');
        $('#jmlh_sks').val('');
    }

    $.tampil();

});