# Dokuso web app:  
## Steps to use the repository:  
-Create ".env.local" as following:  
  
NEXT_PUBLIC_API_KEY=""  
NEXT_PUBLIC_AUTH_DOMAIN=""  
NEXT_PUBLIC_PROJECT_ID=""  
NEXT_PUBLIC_STORAGE_BUCKET=""  
NEXT_PUBLIC_MESSAGIN_SENDER_ID=""  
NEXT_PUBLIC_APP_ID=""  
NEXT_PUBLIC_MESAUREMENT_ID=""  
  
-Run "yarn" to install dependencies  
-Run "yarn dev" to start development server  
-Run "yarn build" to generate a bundle for production environment  
-Run "yarn start" to start running the production build.

# Api search params:  
query = request.args.get('query')  
section = request.args.get('section')  
on_sale = request.args.get("on_sale", default=False, type=bool)  
brand = request.args.get('brand')  
list_ids = request.args.get('ids')  
language = request.args.get('language')  
page = request.args.get('page', default=1, type=int)  
limit = request.args.get('limit', default=10, type=int)  