package com.dicoding.capstoneproject

import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.Menu
import android.view.MenuItem
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.dicoding.capstoneproject.data.inject.ViewModelFactory
import com.dicoding.capstoneproject.databinding.ActivityMainBinding
import com.dicoding.capstoneproject.ui.role.RoleActivity
import com.dicoding.capstoneproject.ui.welcome.WelcomeActivity


class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var factory: ViewModelFactory
    private var token = ""
    private val mainViewModel: MainViewModel by viewModels { factory }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)

        setupView()
        setupViewModel()
        setupUser()
    }

    private fun setupView() {
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }


    private fun setupViewModel() {
        factory = ViewModelFactory.getInstance(this)
    }

    private fun setupUser() {
        mainViewModel.getSession().observe(this@MainActivity) { session ->
            token = session.token
            if (!session.isLogin) {
                moveActivity()
            } else {
                val userName = session.name
                val helloUserText = getString(R.string.username, userName)
                supportActionBar?.title = helloUserText
            }
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menu_mobile, menu)
        return super.onCreateOptionsMenu(menu)
    }

    private fun moveActivity() {
        startActivity(Intent(this@MainActivity, RoleActivity::class.java))
        finish()
    }



    override fun onBackPressed() {
        super.onBackPressed()
        finishAffinity()
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.btn_logout -> {
                mainViewModel.logoutApp()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
}