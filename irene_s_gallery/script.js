let semuaProduk = [];
let produkDitampilkan = 0;
const JUMLAH_PER_LOAD = 6;
let kategoriDipilih = 'semua';
let keywordPencarian = '';

const loadingContainer = document.getElementById('loading-container');
loadingContainer.style.display = 'flex'; // Tampilkan loading saat awal

fetch('https://script.google.com/macros/s/AKfycbz-rOULxiI7TWA0-t72SIrW33TZybPW_UXrtv_al6ZWAkTRfbYoDUUYHJsB0S-R3WJF/exec')
  .then(res => res.json())
  .then(data => {
    semuaProduk = data.produk.flatMap(kategori => kategori.items.map(item => ({
      ...item,
      kategori: kategori.kategori
    })));

    // Sembunyikan loading
    loadingContainer.style.display = 'none';

    // Isi dropdown kategori dari data.kategori
    const select = document.getElementById('kategori-select');
    data.kategori.forEach(kat => {
      const opt = document.createElement('option');
      opt.value = kat;
      opt.textContent = kat;
      select.appendChild(opt);
    });

    // Event: saat kategori berubah
    select.addEventListener('change', () => {
      kategoriDipilih = select.value;
      produkDitampilkan = 0;
      document.getElementById('produk-container').innerHTML = '';
      tampilkanProduk(true);
    });

    const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', () => {
        keywordPencarian = searchInput.value.toLowerCase();
        produkDitampilkan = 0;
        document.getElementById('produk-container').innerHTML = '';
        tampilkanProduk(true);
    });


    select.value = 'semua';
    kategoriDipilih = 'semua';


    // Tampilkan produk awal & tombol
    tampilkanProduk(true);
  })
  .catch(err => {
    document.getElementById('produk-container').innerText = 'Gagal memuat data.';
    loadingContainer.style.display = 'none';
    console.error(err);
  });

function tampilkanProduk(reset = false) {
  const container = document.getElementById('produk-container');
  if (reset) {
    container.innerHTML = '';
    produkDitampilkan = 0;
  }

  let produkFiltered = semuaProduk;
  if (kategoriDipilih !== 'semua') {
    produkFiltered = semuaProduk.filter(p => p.kategori === kategoriDipilih);
  }
  
  // Filter berdasarkan pencarian (nama produk atau deskripsi)
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
    <img src="${item.Foto}" class="produk-gambar" alt="${item['Nama Produk']}" />
    <div class="produk-info">
        <div class="produk-header">
        <h3 class="produk-nama">${item['Nama Produk']}</h3>
        <p class="produk-harga">Rp ${Number(item.Harga).toLocaleString('id-ID')}</p>
        </div>
        <p class="produk-kategori">${item.kategori}</p>
        <p class="produk-deskripsi">${item.Deskripsi}</p>
    </div>
    `;

    container.appendChild(el);
  });

  produkDitampilkan += JUMLAH_PER_LOAD;

  // Tampilkan atau sembunyikan tombol Load More
  let tombol = document.getElementById('load-more');
  if (!tombol) {
    tombol = document.createElement('button');
    tombol.id = 'load-more';
    tombol.textContent = 'Load More';
    tombol.onclick = () => tampilkanProduk(false);
    tombol.style.marginTop = '20px';
    document.body.appendChild(tombol);
  }

  if (keywordPencarian || produkDitampilkan >= produkFiltered.length) {
    tombol.style.display = 'none';
  } else {
    tombol.style.display = 'block';
  }
}
