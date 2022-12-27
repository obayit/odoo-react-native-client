# Odoo React Native Client
This project is still in the early development stage, and major changes may(will) be applied.

### why react-native-svg is not in sync with expo version?

because the expo version causes an error for ui kitten eva icons, see: https://github.com/akveo/react-native-ui-kitten/issues/1675

If you see the error:
```
Attempt to invoke virtual method 'int java.lang.Integer.intValue()' on a null object reference
setTintColor
SvgView.java:1
```
That is because an incompatible version of react-native-svg is installed, see the above issue.
