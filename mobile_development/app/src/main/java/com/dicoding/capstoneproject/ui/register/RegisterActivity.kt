package com.dicoding.capstoneproject.ui.register

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.dicoding.capstoneproject.R
import com.dicoding.capstoneproject.data.inject.ViewModelFactory
import com.dicoding.capstoneproject.databinding.ActivityRegisterBinding
import com.dicoding.capstoneproject.ui.login.LoginActivity


class RegisterActivity : AppCompatActivity() {
    private lateinit var binding: ActivityRegisterBinding
    private lateinit var factory: ViewModelFactory
    private val registerViewModel: RegisterViewModel by viewModels { factory }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setupView()
        setupViewModel()
        playAnimation()
        setupAction()
    }

    private fun setupView() {
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportActionBar?.apply {
            title = getString(R.string.title_register)
            setDisplayHomeAsUpEnabled(true)
        }
    }

    private fun setupViewModel() {
        factory = ViewModelFactory.getInstance(this)
    }

    private fun playAnimation() {
        val cardImg = ObjectAnimator.ofFloat(binding.cardImg, View.ALPHA, 1f).setDuration(300)
        val title = ObjectAnimator.ofFloat(binding.tvTitleRegister, View.ALPHA, 1f).setDuration(300)
        val name = ObjectAnimator.ofFloat(binding.tvNameRegister, View.ALPHA, 1f).setDuration(300)
        val nameInput = ObjectAnimator.ofFloat(binding.tlNameRegister, View.ALPHA, 1f).setDuration(300)
        val email = ObjectAnimator.ofFloat(binding.tvEmailRegister, View.ALPHA, 1f).setDuration(300)
        val emailInput = ObjectAnimator.ofFloat(binding.tlEmailRegister, View.ALPHA, 1f).setDuration(300)
        val password = ObjectAnimator.ofFloat(binding.tvPasswordRegister, View.ALPHA, 1f).setDuration(300)
        val passwordInput = ObjectAnimator.ofFloat(binding.tlPasswordRegister, View.ALPHA, 1f).setDuration(300)
        val registerButton = ObjectAnimator.ofFloat(binding.btnRegister, View.ALPHA, 1f).setDuration(300)

        AnimatorSet().apply {
            playSequentially(cardImg, title, name, nameInput, email, emailInput, password, passwordInput, registerButton)
            startDelay = 500
        }.start()
    }

    private fun setupAction() {
        binding.apply {
            btnRegister.setOnClickListener {
                if (edtNameRegister.length() == 0 && edtEmailRegister.length() == 0 && edtPasswordRegister.length() == 0) {
                    edtNameRegister.error = getString(R.string.required_field)
                    edtEmailRegister.error = getString(R.string.required_field)
                    edtPasswordRegister.setError(getString(R.string.required_field), null)
                } else if (edtNameRegister.length() != 0 && edtEmailRegister.length() != 0 && edtPasswordRegister.length() != 0) {
                    postDataInput()
                }
            }
        }
    }

    private fun postDataInput() {
        binding.apply {
            registerViewModel.dataRegister(
                edtNameRegister.text.toString(),
                edtEmailRegister.text.toString(),
                edtPasswordRegister.text.toString()
            )
        }
        showToast()
    }

    private fun showToast() {
        registerViewModel.toastText.observe(this@RegisterActivity) {
            it.getContentIfNotHandled()?.let { toastText ->
                Toast.makeText(
                    this@RegisterActivity, toastText, Toast.LENGTH_SHORT
                ).show()
                moveActivity()
            }
        }
    }

    private fun moveActivity() {
        registerViewModel.registerResponse.observe(this@RegisterActivity) { response ->
            if (response?.error == false) {
                startActivity(Intent(this@RegisterActivity, LoginActivity::class.java))
                finish()
            }
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return super.onSupportNavigateUp()
    }
}