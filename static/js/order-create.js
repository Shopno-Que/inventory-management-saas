const searchForm = document.querySelector('.order-create-page form[role="search"]');
const container = document.querySelector('.order-create-page');
const olderProducts = document.querySelector('.order-create-page .product-list');

container.addEventListener('click', async (e) => {
  const link = e.target.closest('.page-link');
  if (!link || !container.contains(link)) return;

  e.preventDefault();

  const url = link.href;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'same-origin'
    });

    const data = await response.text();
    renderProducts(data);
    history.pushState({}, '', url);
  } catch (error) {
    console.error("Error fetching page:", error);
  }
});

function renderProducts(html) {
  olderProducts.innerHTML = html;
}

function startLoading() {
  olderProducts.classList.add('opacity-50', 'pointer-events-none'); 
}
function stopLoading() {
  olderProducts.classList.remove('opacity-50', 'pointer-events-none');
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = searchForm.action;
  const method = searchForm.method;
  const formData = new FormData(searchForm);
  const params = new URLSearchParams(formData).toString();
  const fullUrl = `${url}?${params}`;
  try {
    const response = await fetch(fullUrl, {
      method: method,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "same-origin"
    });

    const data = await response.text();
    renderProducts(data);
    history.pushState({}, '', fullUrl);
  } catch (error) {
    console.error("Error:", error);
  }
});
const selectedBody = document.querySelector('.order-create-page .selected-items-body');
const noItemsRow = selectedBody.querySelector('.no-selection');
const orderTotal = document.getElementById('order-total');
const orderSubTotal = document.getElementById('order-sub-total');
const selectedItemsCount = document.querySelector('.selected-items-count');

function updateTotal() {
  let total = 0;

  selectedBody.querySelectorAll('tr:not(.no-selection)').forEach(tr => {
    const priceText = tr.querySelector('.text-xs').textContent.trim();
    const qtyInput = tr.querySelector('input.qty-input');
    const qty = parseInt(qtyInput?.value) || 1;

    // remove currency symbol and convert to number
    const price = parseFloat(priceText.replace(/[^\d\.]/g, '')) || 0;

    total += price * qty;
  });

  selectedItemsCount.textContent = selectedBody.querySelectorAll('tr:not(.no-selection)').length;
  orderTotal.textContent = total.toLocaleString();
  orderSubTotal.textContent = total.toLocaleString();
}

function updateNoItemsState() {
  if (selectedBody.querySelectorAll('tr:not(.no-selection)').length === 0) {
    noItemsRow.style.display = 'table-row';
  } else {
    noItemsRow.style.display = 'none';
  }
}

container.addEventListener('change', (e) => {
  const checkbox = e.target.closest('.product-check');
  if (!checkbox) return;

  const row = checkbox.closest('.orderable-item');
  const qtyInput = row.querySelector('.qty-input');
  const productId = checkbox.dataset.productId;
  const name = row.querySelector('.product-name').textContent.trim();
  const price = row.querySelector('.product-price').textContent.trim();

  if (checkbox.checked) {
    row.classList.add('selected');
    if (qtyInput && qtyInput.value === '0') qtyInput.value = 1;
    handleProductSelect(productId, qtyInput?.value, name, price);
  } else {
    row.classList.remove('selected');
    handleProductUnselect(productId);
  }
});

function handleProductSelect(productId, qty, name, price) {
  const tr = document.createElement('tr');
  tr.dataset.productId = productId;

  tr.innerHTML = `
    <td>
      <button type="button" class="remove-item-btn px-4 py-3 text-rose-500 hover:text-rose-700">✕</button>
    </td>
    <td class="px-4 py-3">
      <div class="font-semibold text-slate-800">${name}</div>
      <div class="text-xs text-slate-400">${price}</div>
      <input form="order-form" type="hidden" name="product_id" value="${productId}">
    </td>
    <td>
      <input name="qty" type="number" min="1" value="${qty}" class="qty-input w-20 text-center rounded-lg border border-slate-200 px-2 py-1">
      <input form="order-form" type="number" name="qty" min="1" value="${qty}" hidden>
    </td>
  `;

  selectedBody.appendChild(tr);
  updateNoItemsState();
  updateTotal();
}

function handleProductUnselect(productId) {
  const row = selectedBody.querySelector(`[data-product-id="${productId}"]`);
  if (row) row.remove();
  updateNoItemsState();
  updateTotal();
}

selectedBody.addEventListener('click', (e) => {
  const btn = e.target.closest('.remove-item-btn');
  if (!btn) return;

  const tr = btn.closest('tr');
  const productId = tr.dataset.productId;

  const sourceCheckbox = container.querySelector(`.product-check[data-product-id="${productId}"]`);
  if (sourceCheckbox) {
    sourceCheckbox.checked = false;
    const sourceRow = sourceCheckbox.closest('.orderable-item');
    const qty = sourceRow.querySelector('.qty-input');
    if (qty) qty.value = 1;
    sourceRow.classList.remove('selected');
  }

  tr.remove();
  updateNoItemsState();
  updateTotal();
});

selectedBody.addEventListener('input', (e) => {
  const qtyInput = e.target.closest('input.qty-input');
  if (!qtyInput) return;

  const tr = qtyInput.closest('tr');

  const hiddenInput = tr.querySelector('input[name="qty"][form="order-form"]');  
  if (hiddenInput) {
    hiddenInput.value = qtyInput.value;
  }
  updateTotal();
});

/* -------------------------
Customer Search
------------------------- */

const customerSearchForm = document.querySelector("[aria-label='Search customers']");
const customerSearchInput = customerSearchForm.querySelector("input[name='q']");
const customerSearchAction = customerSearchForm.action;
const customerSearchMethod = customerSearchForm.method;
const customerSearchResultArea = document.querySelector(".customer-search-result");
const customerResultLoader = customerSearchResultArea.querySelector(".customer-result-loader");
const customerResultListArea = customerSearchResultArea.querySelector(".customer-search-result-list");
const customerName = document.getElementById("customer_name");
const customerPhone = document.getElementById("customer_phone");

function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
async function searchCustomers() {
    const q = customerSearchInput.value.trim();
    if (!q) {
        customerSearchResultArea.classList.add("hidden");
        return;
    }
    customerResultListArea.innerHTML = "";
    customerSearchResultArea.classList.remove("hidden");
    customerResultLoader.classList.remove("hidden");
    const url = `${customerSearchAction}?q=${encodeURIComponent(q)}`;
    try {
        const res = await fetch(url, {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });
        const data = await res.json();
        renderCustomerResults(data);
        customerResultLoader.classList.add("hidden");
    } catch (err) {
        console.error(err);
    } finally {
        customerResultLoader.classList.add("hidden");
    }
}
customerSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchCustomers();
});
customerSearchInput.addEventListener("input", debounce(searchCustomers, 300));
function renderCustomerResults(customers) {
    if (customers.length === 0) {
        customerSearchResultArea.classList.add("hidden");
        return;
    }
    customerResultLoader.classList.add("hidden");
    customerSearchResultArea.classList.remove("hidden");
    customers.forEach(c => {
        const item = document.createElement("div");
        item.className = "px-3 py-2 border-b-1 cursor-pointer hover:bg-slate-50/50 text-sm border-b-slate-200";
        item.innerHTML = `
            <div class="font-medium text-slate-800">${c.name}</div>
            <div class="text-xs text-slate-400">${c.phone}</div>
        `;
        item.onclick = () => selectCustomer(c);
        customerResultListArea.appendChild(item);
    });
}
function selectCustomer(customer) {
    customerResultListArea.innerHTML = "";
    customerSearchResultArea.classList.add("hidden");
    customerName.value = customer.name;
    customerPhone.value = customer.phone;
}
/* 
searchInput.addEventListener("input", () => {

    const keyword = searchInput.value.trim().toLowerCase();

    resultsBox.innerHTML = "";

    if (!keyword) {
        resultsBox.classList.add("hidden");
        return;
    }

    const matches = customers.filter(c =>
        c.phone.includes(keyword) ||
        c.name.toLowerCase().includes(keyword)
    );

    if (matches.length === 0) {
        resultsBox.classList.add("hidden");
        return;
    }

    resultsBox.classList.remove("hidden");

    matches.forEach(c => {
        const item = document.createElement("div");

        item.className =
            "px-3 py-2 cursor-pointer hover:bg-indigo-50 text-sm border-b last:border-none";

        item.innerHTML =
            `<div class="font-semibold text-slate-800">${c.name}</div>
             <div class="text-xs text-slate-500">${c.phone}</div>`;

        item.onclick = () => selectCustomer(c);

        resultsBox.appendChild(item);
    });
});
document.addEventListener("click", (e) => {
    if (!e.target.closest(".relative")) {
        resultsBox.classList.add("hidden");
    }
});
*/
