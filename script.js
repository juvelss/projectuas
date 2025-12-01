// Ini adalah kode yang menjalankan fungsi kalkulator setelah halaman selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
    
    // Ini adalah variabel untuk mengambil elemen layar kalkulator dan gambar status
    const display = document.getElementById('display');
    const statusImage = document.getElementById('statusImage');
    const buttons = document.querySelectorAll('.btn-calc');

    // Ini adalah URL gambar untuk status normal, sukses, dan error kalkulator
    const imgNormal = 'https://placehold.co/400x100/E0F2FE/6B7280?text=Kalkulator';
    const imgSuccess = 'https://placehold.co/400x100/16A34A/FFFFFF?text=Sukses!';
    const imgError = 'https://placehold.co/400x100/DC2626/FFFFFF?text=Error!';

    /**
     * Ini adalah fungsi untuk mengubah gambar status kalkulator berdasarkan kondisi (normal, sukses, atau error)
     */
    function changeImage(state) {
        if (state === 'success') {
            statusImage.src = imgSuccess;
            statusImage.alt = "Perhitungan Sukses";
        } else if (state === 'error') {
            statusImage.src = imgError;
            statusImage.alt = "Error Perhitungan";
        } else {
            // Ini adalah kondisi default untuk mengembalikan gambar ke status normal
            statusImage.src = imgNormal;
            statusImage.alt = "Status Kalkulator";
        }
    }

    /**
     * Ini adalah fungsi untuk menghapus semua isi layar kalkulator dan mengatur ulang gambar status
     */
    function clearDisplay() {
        display.value = '';
        changeImage('normal'); // Memanggil fungsi untuk mengubah gambar ke normal
    }

    /**
     * Ini adalah fungsi untuk menghapus karakter terakhir di layar kalkulator
     */
    function deleteLastChar() {
        display.value = display.value.slice(0, -1);
    }

    /**
     * Ini adalah fungsi untuk menambahkan nilai (angka atau operator) ke layar kalkulator
     */
    function appendToDisplay(value) {
        display.value += value;
    }

    /**
     * Ini adalah fungsi utama untuk menghitung hasil perhitungan berdasarkan isi layar
     */
    function calculateResult() {
        // Ini adalah pengecekan jika layar kosong, maka tampilkan error
        if (display.value === '') {
            changeImage('error');
            display.value = 'Kosong!';
            // Ini adalah timer untuk menghapus pesan error setelah 1.5 detik
            setTimeout(clearDisplay, 1500);
            return;
        }

        try {
            // Ini adalah proses menghitung menggunakan eval, dengan mengganti % menjadi /100 untuk persen
            let result = eval(display.value
                .replace(/%/g, '/100') // Mengubah simbol % menjadi pembagian 100 untuk menghitung persen
            ); 
            
            // Ini adalah pengecekan jika hasil valid (bukan tak terhingga), maka tampilkan dan ubah gambar ke sukses
            if (isFinite(result)) {
                display.value = result;
                changeImage('success'); // Mengubah gambar ke sukses
            } else {
                throw new Error("Hasil tidak valid");
            }

        } catch (error) {
            console.error("Error kalkulasi:", error);
            display.value = 'Error';
            changeImage('error'); // Mengubah gambar ke error
            setTimeout(clearDisplay, 1500);
        }
    }


    // Ini adalah loop untuk menambahkan event klik pada setiap tombol kalkulator
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');

            // Ini adalah switch case untuk menentukan aksi berdasarkan nilai tombol yang diklik
            switch(value) {
                case 'C':
                    // Jika tombol C diklik, bersihkan layar
                    clearDisplay();
                    break;
                case 'DEL':
                    // Jika tombol DEL diklik, hapus karakter terakhir
                    deleteLastChar();
                    break;
                case '=':
                    // Jika tombol = diklik, hitung hasil
                    calculateResult();
                    break;
                default:
                    // Untuk tombol lain (angka/operator), jika status gambar adalah sukses/error, bersihkan dulu lalu tambahkan nilai
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay();
                    }
                    appendToDisplay(value);
                    break;
            }
        });
    });

    // Ini adalah event listener untuk mendeteksi penekanan tombol keyboard
    document.addEventListener('keydown', (e) => {
        const key = e.key;

        if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                clearDisplay();
            }
            appendToDisplay(key);
            e.preventDefault();
        } else if (key === 'Enter' || key === '=') {
            calculateResult();
            e.preventDefault();
        } else if (key === 'Backspace') {
            deleteLastChar();
            e.preventDefault();
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            clearDisplay();
            e.preventDefault();
        }
    });

});
