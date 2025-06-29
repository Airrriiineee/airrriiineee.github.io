
let semuaProduk = [];
let produkDitampilkan = 0;
const JUMLAH_PER_LOAD = 6;
let momentDipilih = 'semua';
let jenisDipilih = 'semua';
let keywordPencarian = '';

const loadingContainer = document.getElementById('loading-container');
loadingContainer.style.display = 'flex';

fetch('https://script.google.com/macros/s/AKfycbzXvV7HGnURPwqM-jEdkCcH7u4XBLUjnbYa-PcX9jOcfufE_g8pTKiwgS3YQplQosnR9g/exec')
  .then(res => res.json())
  .then(data => {
    semuaProduk = data.produk;

    data.kategori.moment.forEach(kat => {
      const opt = document.createElement('option');
      opt.value = kat;
      opt.textContent = kat;
      document.getElementById('moment-select').appendChild(opt);
    });

    data.kategori.jenis.forEach(kat => {
      const opt = document.createElement('option');
      opt.value = kat;
      opt.textContent = kat;
      document.getElementById('jenis-select').appendChild(opt);
    });

    loadingContainer.style.display = 'none';
    tampilkanProduk(true);
  })
  .catch(err => {
    document.getElementById('produk-container').innerText = 'Gagal memuat data.';
    loadingContainer.style.display = 'none';
    console.error(err);
  });

document.getElementById('moment-select').addEventListener('change', e => {
  momentDipilih = e.target.value;
  produkDitampilkan = 0;
  tampilkanProduk(true);
});

document.getElementById('jenis-select').addEventListener('change', e => {
  jenisDipilih = e.target.value;
  produkDitampilkan = 0;
  tampilkanProduk(true);
});

document.getElementById('search-input').addEventListener('input', e => {
  keywordPencarian = e.target.value.toLowerCase();
  produkDitampilkan = 0;
  tampilkanProduk(true);
});

function tampilkanProduk(reset = false) {
  const container = document.getElementById('produk-container');
  if (reset) {
    container.innerHTML = '';
    produkDitampilkan = 0;
  }

  let produkFiltered = semuaProduk;

  if (momentDipilih !== 'semua') {
    produkFiltered = produkFiltered.filter(p => p.Moment === momentDipilih);
  }

  if (jenisDipilih !== 'semua') {
    produkFiltered = produkFiltered.filter(p => p.Jenis === jenisDipilih);
  }

  if (keywordPencarian) {
    produkFiltered = produkFiltered.filter(p =>
      p["Nama Produk"].toLowerCase().includes(keywordPencarian) ||
      p.Deskripsi.toLowerCase().includes(keywordPencarian)
    );
  }

  const slice = produkFiltered.slice(produkDitampilkan, produkDitampilkan + JUMLAH_PER_LOAD);

  slice.forEach(item => {
    const el = document.createElement('div');
    el.className = 'produk-card';
    el.innerHTML = `
      <img src="${item.Foto}" class="produk-gambar" alt="${item["Nama Produk"]}" />
      <div class="produk-info">
        <div class="produk-header">
          <h3 class="produk-nama">${item["Nama Produk"]}</h3>
          <p class="produk-harga">Rp ${Number(item.Harga).toLocaleString('id-ID')}</p>
        </div>
        <p class="produk-kategori">${[item.Moment, item.Jenis].filter(Boolean).join(', ')}</p>
        <p class="produk-deskripsi">${item.Deskripsi}</p>
      </div>
    `;
    container.appendChild(el);
  });

  produkDitampilkan += JUMLAH_PER_LOAD;

  let tombol = document.getElementById('load-more');
  if (!tombol) {
    tombol = document.createElement('button');
    tombol.id = 'load-more';
    tombol.textContent = 'Load More';
    tombol.onclick = () => tampilkanProduk(false);
    document.body.appendChild(tombol);
  }

  tombol.style.display = (produkDitampilkan >= produkFiltered.length || produkFiltered.length === 0) ? 'none' : 'block';
}
