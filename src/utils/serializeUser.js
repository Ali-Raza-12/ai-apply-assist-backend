export const serializeUser = (user) => ({
 id: user._id,
 name: user.name,
 email: user.email,
 phone: user.phone,
 github: user.github,
 linkedin: user.linkedin,
 portfolio: user.portfolio,
 cvUrl: user.cvUrl,
 parsedCV: user.parsedCV
});