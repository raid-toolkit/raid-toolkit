Steps to access account information via the REST API:
* Enable the server by clicking the cloud button in the top right of the application
  ![image](https://user-images.githubusercontent.com/500984/120867177-657a2200-c55f-11eb-8ad1-8efb4b0f874b.png)
* Click on the green URL to open the swagger documentation page
* Scoll down to the `oauth/authorize` endpoint and click `Try it!`
* Update the sample schema to your application information, for example:
  ```json
  {
    "appId": "my-app",
    "name": "My Raid Tool",
    "author": "somedude@example.com",
    "description": "My really cool Raid app, powered by Raid Toolkit",
    "scopes": {
      "read:heroes": "Use hero information to make team recommendations",
      "read:artifacts": "Use stats information to calculate damage",
      "read:shards": "Provide insight on shard usage"
    }
  }
  ```
  ![image](https://user-images.githubusercontent.com/500984/120867373-c86bb900-c55f-11eb-9602-84ce1f2faca2.png)
 * Click `execute`
 * Switch to Raid Toolkit and observe the permissions request, click `Grant`
   ![image](https://user-images.githubusercontent.com/500984/120867491-0e288180-c560-11eb-80ed-b543f412f099.png)
 * A response will appear on the documentation page, containing your app registration including your app secret.
   ![image](https://user-images.githubusercontent.com/500984/120867563-2c8e7d00-c560-11eb-9673-4e1aa22add5a.png)
 * Copy your app id and secret, and click the `Authorize` button at the top right of the page.
 * Enter your app id/secret pair, and check the permissions you intend to use in your application
   ![image](https://user-images.githubusercontent.com/500984/120867640-5647a400-c560-11eb-84c0-5231f037ba93.png)
 * Close the dialog
 * Now you can access any of the APIs that you've requested scopes for!

Can use this model to implement your application making these same requests.  Each time the toolkit is restarted, you will have to re-request a jwt token using your app-id and secret, which are unique to that users installation.
