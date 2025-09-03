// تعيين تاريخ اليوم كتاريخ افتراضي
document.getElementById('invoiceDate').valueAsDate = new Date();

// إضافة مستمعي الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تبديل الحقول بناءً على نوع العميل
    document.querySelectorAll('input[name="clientType"]').forEach(radio => {
        radio.addEventListener('change', toggleClientFields);
    });
    
    // إضافة صف جديد
    document.getElementById('addRowBtn').addEventListener('click', addRow);
    
    // إضافة مستمعي الأحداث لحقول الإدخال
    document.querySelectorAll('.item-qty, .item-price, .item-shipping').forEach(input => {
        input.addEventListener('input', function() {
            calculateTotal(this);
        });
    });
    
    // المبلغ المقدم
    document.getElementById('advancePayment').addEventListener('input', calculateRemaining);
    
    // طباعة الفاتورة
    document.getElementById('printBtn').addEventListener('click', function() {
        window.print();
    });
    
    // إضافة مستمعي الأحداث لأزرار الحذف
    document.querySelectorAll('.remove-row-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            removeRow(this);
        });
    });
});

// تبديل الحقول بناءً على نوع العميل
function toggleClientFields() {
    const clientType = document.querySelector('input[name="clientType"]:checked').value;
    const companyField = document.getElementById('companyField');
    const galleryField = document.getElementById('galleryField');
    const companyName = document.getElementById('companyName');
    const galleryName = document.getElementById('galleryName');
    
    companyField.style.display = 'none';
    galleryField.style.display = 'none';
    companyName.removeAttribute('required');
    galleryName.removeAttribute('required');
    
    if (clientType === 'company') {
        companyField.style.display = 'block';
        companyName.setAttribute('required', '');
    } else if (clientType === 'merchant') {
        galleryField.style.display = 'block';
        galleryName.setAttribute('required', '');
    }
}

// إضافة صف جديد لجدول العناصر
function addRow() {
    const table = document.getElementById('itemsTable').getElementsByTagName('tbody')[0];
    const rowCount = table.rows.length;
    const row = table.insertRow();
    
    row.innerHTML = `
        <td>${rowCount + 1}</td>
        <td><input type="text" class="item-desc" placeholder="وصف الصنف"></td>
        <td><input type="number" class="item-qty" min="1" value="1"></td>
        <td><input type="number" class="item-price" min="0" step="0.01" value="0"></td>
        <td><input type="number" class="item-shipping" min="0" step="0.01" value="0"></td>
        <td class="item-total">0.00</td>
        <td><button type="button" class="btn-danger remove-row-btn">x</button></td>
    `;
    
    // إضافة مستمعي الأحداث للحقول الجديدة
    row.querySelector('.item-qty').addEventListener('input', function() {
        calculateTotal(this);
    });
    row.querySelector('.item-price').addEventListener('input', function() {
        calculateTotal(this);
    });
    row.querySelector('.item-shipping').addEventListener('input', function() {
        calculateTotal(this);
    });
    
    // إضافة مستمع الحدث لزر الحذف
    row.querySelector('.remove-row-btn').addEventListener('click', function() {
        removeRow(this);
    });
    
    // تحديث أرقام الصفوف
    updateRowNumbers();
}

// إزالة صف من جدول العناصر
function removeRow(button) {
    const row = button.parentNode.parentNode;
    if (document.getElementById('itemsTable').rows.length > 2) {
        row.parentNode.removeChild(row);
        updateRowNumbers();
        calculateGrandTotal();
        calculateRemaining();
    }
}

// تحديث أرقام الصفوف في الجدول
function updateRowNumbers() {
    const rows = document.getElementById('itemsTable').getElementsByTagName('tbody')[0].rows;
    for (let i = 0; i < rows.length; i++) {
        rows[i].cells[0].innerHTML = i + 1;
    }
}

// حساب الإجمالي للصف
function calculateTotal(input) {
    const row = input.parentNode.parentNode;
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const shipping = parseFloat(row.querySelector('.item-shipping').value) || 0;
    const total = (qty * price) + shipping;
    
    row.querySelector('.item-total').textContent = total.toFixed(2);
    calculateGrandTotal();
    calculateRemaining();
}

// حساب المجموع الكلي للفاتورة
function calculateGrandTotal() {
    const totals = document.querySelectorAll('.item-total');
    let grandTotal = 0;
    
    totals.forEach(totalCell => {
        grandTotal += parseFloat(totalCell.textContent) || 0;
    });
    
    document.getElementById('grandTotal').textContent = grandTotal.toFixed(2);
    return grandTotal;
}

// حساب المبلغ المتبقي
function calculateRemaining() {
    const grandTotal = calculateGrandTotal();
    const advance = parseFloat(document.getElementById('advancePayment').value) || 0;
    const remaining = grandTotal - advance;
    
    document.getElementById('remainingPayment').value = remaining.toFixed(2);
}
