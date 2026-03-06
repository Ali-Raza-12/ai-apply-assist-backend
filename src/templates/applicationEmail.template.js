export const applicationEmailTemplate = (user, emailBody) =>  `
<p>Dear Hiring Manager,</p>

<p>${emailBody}</p>

<br/>

<p>Best Regards,</p>
<strong>${user.name}</strong><br/>
Email: ${user.email}<br/>
${user.klinkedin ?  `LinkedIn: <a href="${user.linkedin}">${user.linkedin}</a><br/>` : "" }
${user.github ? `GitHub: <a href="${user.github}">${user.github}</a><br/>` : "" }
${user.portfolio ? `Portfolio: <a href="${user.portfolio}">${user.portfolio}</a>` : "" }
`;
