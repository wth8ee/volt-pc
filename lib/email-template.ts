export function generateOrderEmailHtml(order: any) {
  const itemsHtml = order.items
    .map(
      (item: any) => `
    <tr style="border-bottom: 1px solid #e4e4e7;">
      <td style="padding: 12px 0; font-size: 13px; color: #18181b; font-family: sans-serif;">
        ${item.product.name}
      </td>
      <td style="padding: 12px 0; font-size: 13px; color: #71717a; font-family: monospace; text-align: center;">
        ${item.quantity} шт.
      </td>
      <td style="padding: 12px 0; font-size: 13px; color: #18181b; font-family: monospace; text-align: right; font-weight: bold;">
        ${(item.price * item.quantity).toLocaleString("ru-RU")} ₽
      </td>
    </tr>
  `,
    )
    .join("");

  return `
    <div style="background-color: #ffffff; padding: 40px 20px; font-family: sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e4e4e7;">
      <div style="margin-bottom: 30px; border-b: 1px solid #18181b; padding-bottom: 15px;">
        <h1 style="font-size: 18px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #18181b; margin: 0;">
          VOLTPC / <span style="color: #a1a1aa; font-weight: 300; text-transform: lowercase;">документ оплаты</span>
        </h1>
      </div>
      
      <p style="font-size: 13px; color: #71717a; line-height: 1.6; margin-bottom: 30px;">
        Здравствуйте, ${order.customerName}. Ваш платеж успешно зарегистрирован шлюзом. Спецификация комплектующих передана в инженерный отдел и принята в производство.
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="border-bottom: 2px solid #18181b;">
            <th style="text-align: left; padding-bottom: 8px; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #71717a; letter-spacing: 1px;">Компонент</th>
            <th style="text-align: center; padding-bottom: 8px; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #71717a; letter-spacing: 1px; width: 60px;">Кол-во</th>
            <th style="text-align: right; padding-bottom: 8px; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #71717a; letter-spacing: 1px; width: 100px;">Цена</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="border-top: 2px solid #18181b; padding-top: 15px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #71717a; letter-spacing: 1px;">Итоговая стоимость:</span>
        <span style="font-size: 16px; font-weight: bold; color: #18181b; font-family: monospace;">${order.totalAmount.toLocaleString("ru-RU")} ₽</span>
      </div>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e4e4e7; text-align: center;">
        <p style="font-size: 11px; color: #a1a1aa; margin: 0;">Это автоматический чек верификации. Пожалуйста, не отвечайте на это письмо.</p>
        <p style="font-size: 11px; color: #a1a1aa; margin: 5px 0 0 0;">VoltPC © ${new Date().getFullYear()}</p>
      </div>
    </div>
  `;
}
