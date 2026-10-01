const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware untuk memproses data dari form HTML
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Menyajikan file HTML statis
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint API untuk menghitung BMI
app.post('/hitung-bmi', (req, res) => {
    const beratBadan = parseFloat(req.body.berat);
    const tinggiBadanCm = parseFloat(req.body.tinggi);

    if (isNaN(beratBadan) || isNaN(tinggiBadanCm) || beratBadan <= 0 || tinggiBadanCm <= 0) {
        return res.status(400).json({ error: 'Harap masukkan angka yang valid!' });
    }

    const tinggiBadanM = tinggiBadanCm / 100;
    const bmi = beratBadan / (tinggiBadanM * tinggiBadanM);
    const beratIdealMin = 18.5 * (tinggiBadanM * tinggiBadanM);
    const beratIdealMax = 24.9 * (tinggiBadanM * tinggiBadanM);

    let kategori = "";
    if (bmi < 18.5) {
        kategori = "Kekurangan Berat Badan (Underweight)";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        kategori = "Normal (Ideal)";
    } else if (bmi >= 25.0 && bmi <= 29.9) {
        kategori = "Kelebihan Berat Badan (Overweight)";
    } else {
        kategori = "Obesitas";
    }

    res.json({
        bmi: bmi.toFixed(2),
        kategori: kategori,
        idealMin: beratIdealMin.toFixed(1),
        idealMax: beratIdealMax.toFixed(1)
    });
});

// Jalankan Web Server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});