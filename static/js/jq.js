

$(document).ready(function() {
    
    let data_base = [];
    
    $.tampil();

    $.tampil = function() {
        let table = `<table class="table table-striped" id="myTable">
                        <thead class="sticky-top bg-secondary text-light">
                            <tr>
                                <th>No</th>
                                <th>Nama Matkul</th>
                                <th>Hari</th>
                                <th>Jam</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>`;
        if (data_base) {
            $.each(data_base, function(index, value) {
                table +=            `<tr>
                                        <td>${index+1}</td>
                                        <td>${value[0]}</td>
                                        <td>${value[1]}</td>
                                        <td>${value[2]}-${value[3]}</td>
                                        <td>
                                            <a onclick="$.hapus(${index})" class="btn btn-danger">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                                </svg>
                                            </a>
                                        </td>
                                    </tr>`;
            });
        } 
        if (!data_base) {
            table += `<tr><td>1</td><td>1</td><td1></td><td>1</td><td>1</td></tr>`;
        }
        table += `</tbody></table>`;
        $('#wadah').html(table);
    }

    $('#form_matkul').submit(function(event) {
        let nama_matkul = $(this).find('#nama_matkul').val();
        let hari = $(this).find('#hari').val();
        let jam_mulai = $(this).find('#jam_mulai').val();
        let jam_akhir = $(this).find('#jam_akhir').val();
        let data = [nama_matkul, hari, jam_mulai, jam_akhir];

        let tabrakan = '';
        $.each(data_base, function(index, value) {
            if (hari == value[1]) {
                if (jam_mulai >= value[2] && jam_mulai <= value[3]) {
                    tabrakan = `tabrakan dengan "${value[0]}"`;
                } else if (jam_akhir >= value[2] && jam_akhir <= value[3]) {
                    tabrakan = `tabrakan dengan "${value[0]}"`;
                } else if (value[2] >= jam_mulai && value[2] <= jam_akhir) {
                    tabrakan = `tabrakan dengan "${value[0]}"`;
                } else if (value[3] >= jam_mulai && value[3] <= jam_akhir) {
                    tabrakan = `tabrakan dengan "${value[0]}"`;
                }
            }
        });

        if (tabrakan) {
            alert(tabrakan);
        } else {
            data_base.push(data);
        }

        $.tampil();

        event.preventDefault();
    });

    $.hapus = function(index) {
        data_base.splice(index, 1);
        $.tampil();
    }

});